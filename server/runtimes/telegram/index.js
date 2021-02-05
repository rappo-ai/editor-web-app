const axios = require('axios').default;
const queue = require('async/queue');
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
const { getWebserverHost, getWebserverUrl } = require('../../utils/host');

function getWebhookUrl(botId, botSecret) {
  return getWebserverUrl(`/webhooks/telegram/${botId}/${botSecret}`);
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

  const { deployments } = bot;
  if (deployments.telegram && deployments.telegram.token) {
    await deleteWebhook(deployments.telegram.token).catch(err =>
      console.log(err),
    );
  }

  const botSecret = nanoid();
  const apiResponse = await setWebhook(botToken, bot.id, botSecret);
  deployments.telegram = {
    token: botToken,
    secret: botSecret,
  };
  await db.update('bots', bot.id, { deployments });

  await setDefaultCommands(botToken).catch(err => console.log(err));

  return {
    apiResponse: apiResponse.data,
    bot,
    webhookHost: getWebserverHost(),
  };
}

async function unpublishTelegram(bot) {
  let apiResponse = null;

  const { deployments } = bot;
  if (deployments.telegram && deployments.telegram.token) {
    await removeDefaultCommands(deployments.telegram.token).catch(err =>
      console.log(err),
    );
    apiResponse = await deleteWebhook(deployments.telegram.token).catch(err =>
      console.log(err),
    );
  }

  deployments.telegram = {};

  await db.update('bots', bot.id, { deployments });

  return {
    apiResponse: apiResponse && (apiResponse.data || apiResponse),
    bot,
  };
}

const userQueueMap = {};
function createUserQueue(telegramUserId) {
  userQueueMap[telegramUserId] = queue(processUpdate, 1);
  return userQueueMap[telegramUserId];
}
function getUserQueue(telegramUser) {
  return userQueueMap[telegramUser.id] || createUserQueue(telegramUser.id);
}

async function endConversation(chatsession, bot) {
  const sendMessageRequestBody = {
    chat_id: chatsession.telegramChatId,
    text:
      'This conversation has ended. Click /restart to restart the conversation.',
    reply_markup: {
      remove_keyboard: true,
    },
  };
  // eslint-disable-next-line no-unused-vars
  const sendMessageApiResponse = await callTelegramApi(
    'sendMessage',
    bot.deployments.telegram.token,
    sendMessageRequestBody,
  );
}
async function processUpdate(task, callback) {
  try {
    const bot = await db.get('bots', task.botId);

    if (!bot) {
      throw new Error('bot not found');
    }

    if (!bot.deployments || !bot.deployments.telegram) {
      throw new Error('bot telegram deployment not found');
    }

    if (bot.deployments.telegram.secret !== task.botSecret) {
      throw new Error('bot secret mismatch');
    }

    const model = await db.get('models', {
      property: 'botId',
      value: bot.id,
    });

    if (!model) {
      throw new Error('model not found');
    }

    let chatsession = await db.get('chatsessions', {
      property: 'telegramChatId',
      value: task.update.message.chat.id,
    });

    if (!chatsession) {
      chatsession = await db.create('chatsessions', {
        telegramChatId: task.update.message.chat.id,
      });
    }

    const transitionEventType = TRANSITION_EVENT_TYPE_RESPONSE;
    let transitionEventValue = task.isNullTransition
      ? ''
      : task.update.message.text;
    if (
      transitionEventValue === '/start' ||
      transitionEventValue === '/restart'
    ) {
      await db.update(chatsession, { botStateId: 'START' });
      transitionEventValue = '';
    }
    const getNextStateResponse = getNextState(
      model,
      chatsession.botStateId,
      transitionEventType,
      transitionEventValue,
    );

    if (!getNextStateResponse.state) {
      await endConversation(chatsession, bot);
      return;
    }

    const sendMessageRequestBody = {
      chat_id: chatsession.telegramChatId,
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
      bot.deployments.telegram.token,
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
        callback,
      );
    }

    await db.update(chatsession, { botStateId: getNextStateResponse.state.id });
  } catch (err) {
    if (callback) {
      callback(err);
    }
  }
}

module.exports = {
  publishTelegram,
  unpublishTelegram,
  getUserQueue,
};
