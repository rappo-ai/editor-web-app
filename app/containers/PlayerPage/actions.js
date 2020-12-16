/*
 *
 * PlayerPage actions
 *
 */

export function loadBotModel(botId, createIfNone, token) {
  return {
    type: 'LOAD_BOT_MODEL',
    botId,
    createIfNone,
    token,
  };
}

export function addStateWithTransition(params) {
  return {
    type: 'ADD_STATE_WITH_TRANSITION',
    ...params,
  };
}

export function setTransitionEvent(event, modelId, token) {
  return {
    type: 'SET_TRANSITION_EVENT',
    event,
    modelId,
    token,
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
export function branchFromState(params) {
  return {
    type: 'BRANCH_FROM_STATE',
    ...params,
  };
}
