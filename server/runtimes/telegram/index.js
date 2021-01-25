const axios = require('axios').default;
const priorityQueue = require('async/priorityQueue');
const deepEqual = require('deep-equal');
const { nanoid } = require('nanoid');
const db = require('../../db');
const { API_VALIDATE_REQUEST_BODY_PARAMETERS } = require('../../utils/api');
const {
  getNextState,
  hasOutTransition,
  hasNullOutTransition,
  TRANSITION_EVENT_TYPE_RESPONSE,
} = require('../../utils/bot');
const { getHttpsHost } = require('../../utils/host');

function getWebhookUrl(botId, botSecret) {
  return `https://${getHttpsHost()}/webhooks/telegram/${botId}/${botSecret}`;
}

async function callTelegramApi(endpoint, token, body = {}) {
  return axios.post(`https://api.telegram.org/bot${token}/${endpoint}`, {
    ...body,
  });
}

/* async function getWebhookInfo(token) {
  return callTelegramApi(`getWebhookInfo`, token);
} */

async function setWebhook(token, botId, botSecret) {
  const body = {
    url: getWebhookUrl(botId, botSecret),
  };
  return callTelegramApi(`setWebhook`, token, body);
}

async function deleteWebhook(token) {
  const body = {
    drop_pending_updates: true,
  };
  return callTelegramApi(`deleteWebhook`, token, body);
}

const RESTART_COMMAND = {
  command: 'restart',
  description: 'Restart the chatbot',
};
const DEFAULT_COMMANDS = [RESTART_COMMAND];

async function setDefaultCommands(token) {
  const getMyCommandsApiResponse = await callTelegramApi(
    `getMyCommands`,
    token,
  );

  const commands = getMyCommandsApiResponse.data.result;

  DEFAULT_COMMANDS.forEach(defaultCommand => {
    if (
      !commands.some(
        rawCommand => rawCommand.command === defaultCommand.command,
      )
    ) {
      commands.push(defaultCommand);
    }
  });

  const body = {
    commands,
  };

  return callTelegramApi(`setMyCommands`, token, body);
}

async function removeDefaultCommands(token) {
  const getMyCommandsApiResponse = await callTelegramApi(
    `getMyCommands`,
    token,
  );
  let commands = getMyCommandsApiResponse.data.result;
  commands = commands.filter(
    rawCommand =>
      !DEFAULT_COMMANDS.some(defaultCommand =>
        deepEqual(defaultCommand, rawCommand, { strict: true }),
      ),
  );
  const body = {
    commands,
  };
  return callTelegramApi(`setMyCommands`, token, body);
}

async function publishTelegram(bot, { botToken }) {
  API_VALIDATE_REQUEST_BODY_PARAMETERS({ botToken });
  if (bot.telegrambottoken) {
    await deleteWebhook(bot.telegrambottoken);
  }

  const botSecret = nanoid();
  const apiResponse = await setWebhook(botToken, bot.id, botSecret);
  await bot.set('telegrambottoken', botToken);
  await bot.set('telegrambotsecret', botSecret);

  await setDefaultCommands(botToken);

  return {
    apiResponse: apiResponse.data,
    webhookHost: getHttpsHost(),
  };
}

async function unpublishTelegram(bot) {
  let apiResponse = null;
  if (bot.telegrambottoken) {
    await removeDefaultCommands(bot.telegrambottoken);
    apiResponse = await deleteWebhook(bot.telegrambottoken);
  }

  await bot.set('telegrambottoken', '');
  await bot.set('telegrambotsecret', '');

  return {
    apiResponse: apiResponse && apiResponse.data,
  };
}

const userQueueMap = {};
function createUserQueue(telegramUserId) {
  userQueueMap[telegramUserId] = priorityQueue(processUpdate, 1);
  return userQueueMap[telegramUserId];
}
function getUserQueue(telegramUser) {
  return userQueueMap[telegramUser.id] || createUserQueue(telegramUser.id);
}

async function endConversation(chatsession, bot) {
  const sendMessageRequestBody = {
    chat_id: chatsession.telegramchatid,
    text:
      'This conversation has ended. Click /restart to restart the conversation.',
    reply_markup: {
      remove_keyboard: true,
    },
  };
  // eslint-disable-next-line no-unused-vars
  const sendMessageApiResponse = await callTelegramApi(
    'sendMessage',
    bot.telegrambottoken,
    sendMessageRequestBody,
  );
}
async function processUpdate(task, callback) {
  try {
    const bot = await db.get('bot', {
      property: 'id',
      value: task.botId,
    });

    if (!bot) {
      throw new Error('bot not found');
    }

    if (bot.telegrambotsecret !== task.botSecret) {
      throw new Error('bot secret mismatch');
    }

    const model = await db.get('model', {
      property: 'botid',
      value: bot.id,
    });

    if (!model) {
      throw new Error('model not found');
    }

    let chatsession = await db.get('chatsession', {
      property: 'telegramchatid',
      value: task.update.message.chat.id,
    });

    if (!chatsession) {
      chatsession = await db.create('chatsession');
      await chatsession.set('telegramchatid', task.update.message.chat.id);
    }

    const transitionEventType = TRANSITION_EVENT_TYPE_RESPONSE;
    let transitionEventValue = task.isNullTransition
      ? ''
      : task.update.message.text;
    if (
      transitionEventValue === '/start' ||
      transitionEventValue === '/restart'
    ) {
      await chatsession.set('botstateid', 'START');
      transitionEventValue = '';
    }
    const getNextStateResponse = getNextState(
      model,
      chatsession.botstateid,
      transitionEventType,
      transitionEventValue,
    );

    if (!getNextStateResponse.state) {
      await endConversation(chatsession, bot);
      return;
    }

    const sendMessageRequestBody = {
      chat_id: chatsession.telegramchatid,
      text: getNextStateResponse.state.message,
    };
    if (
      getNextStateResponse.state.responses &&
      getNextStateResponse.state.responses.length
    ) {
      sendMessageRequestBody.reply_markup = {
        keyboard: getNextStateResponse.state.responses.map(response => [
          response,
        ]),
        one_time_keyboard: true,
        resize_keyboard: true,
      };
    } else {
      sendMessageRequestBody.reply_markup = {
        remove_keyboard: true,
      };
    }

    // eslint-disable-next-line no-unused-vars
    const sendMessageApiResponse = await callTelegramApi(
      'sendMessage',
      bot.telegrambottoken,
      sendMessageRequestBody,
    );

    if (!hasOutTransition(model, getNextStateResponse.state.id)) {
      await endConversation(chatsession, bot);
    }

    if (hasNullOutTransition(model, getNextStateResponse.state.id)) {
      getUserQueue(task.update.message.from.id).push(
        {
          ...task,
          isNullTransition: true,
        },
        task.update.update_id,
        callback,
      );
    }

    await chatsession.set('botstateid', getNextStateResponse.state.id);
  } catch (err) {
    callback(err);
  }
}

module.exports = {
  publishTelegram,
  unpublishTelegram,
  getUserQueue,
};
