const { API_THROW_ERROR } = require('../utils/api');
const { publishTelegram, unpublishTelegram } = require('./telegram');
const { publishWeb, unpublishWeb } = require('./web');

const RUNTIME_WEB = 'web';
const RUNTIME_TELEGRAM = 'telegram';

// eslint-disable-next-line consistent-return
function publishRuntime(bot, runtime, params) {
  switch (runtime) {
    case RUNTIME_WEB:
      return publishWeb(bot, params);
    case RUNTIME_TELEGRAM:
      return publishTelegram(bot, params);
    default:
      break;
  }
  API_THROW_ERROR(true, 404, 'Runtime not found');
}

// eslint-disable-next-line consistent-return
function unpublishRuntime(bot, runtime, params) {
  switch (runtime) {
    case RUNTIME_WEB:
      return unpublishWeb(bot, params);
    case RUNTIME_TELEGRAM:
      return unpublishTelegram(bot, params);
    default:
      break;
  }
  API_THROW_ERROR(true, 404, 'Runtime not found');
}

module.exports = {
  publishRuntime,
  unpublishRuntime,
};
