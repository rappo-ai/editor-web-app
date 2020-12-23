/*
 *
 * PlayerPage actions
 *
 */

export function clearChatHistory() {
  return {
    type: 'CLEAR_CHAT_HISTORY',
  };
}

export function doTransitionToState(params) {
  return {
    type: 'DO_TRANSITION_TO_STATE',
    ...params,
  };
}

export function loadBotModel(botId, accessToken) {
  return {
    type: 'LOAD_BOT_MODEL',
    botId,
    accessToken,
  };
}

export function loadPlayerBot(botId, accessToken) {
  return {
    type: 'LOAD_PLAYER_BOT',
    botId,
    accessToken,
  };
}

export function setTransitionEvent(event, modelId) {
  return {
    type: 'SET_TRANSITION_EVENT',
    event,
    modelId,
  };
}
