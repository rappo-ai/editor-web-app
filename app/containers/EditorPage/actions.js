/*
 *
 * EditorPage actions
 *
 */

export function loadBotModel(botId, createIfNone) {
  return {
    type: 'LOAD_BOT_MODEL',
    botId,
    createIfNone,
  };
}

export function addStateWithTransition(params) {
  return {
    type: 'ADD_STATE_WITH_TRANSITION',
    ...params,
  };
}

export function setTransitionEvent(event, modelId) {
  return {
    type: 'SET_TRANSITION_EVENT',
    event,
    modelId,
  };
}

export function doTransitionToState(params) {
  return {
    type: 'DO_TRANSITION_TO_STATE',
    ...params,
  };
}

export function clearChatHistory() {
  return {
    type: 'CLEAR_CHAT_HISTORY',
  };
}

export function updateState(params) {
  return {
    type: 'UPDATE_STATE',
    ...params,
  };
}

export function deleteState(params) {
  return {
    type: 'DELETE_STATE',
    ...params,
  };
}

export function addTransition(params) {
  return {
    type: 'ADD_TRANSITION',
    ...params,
  };
}

export function deleteTransition(params) {
  return {
    type: 'DELETE_TRANSITION',
    ...params,
  };
}

export function publishBot(params) {
  return {
    type: 'PUBLISH_BOT',
    ...params,
  };
}
