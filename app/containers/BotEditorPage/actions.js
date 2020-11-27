/*
 *
 * BotEditorPage actions
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

export function setTransitionEvent(event) {
  return {
    type: 'SET_TRANSITION_EVENT',
    event,
  };
}

export function doTransitionToState(params) {
  return {
    type: 'DO_TRANSITION_TO_STATE',
    ...params,
  };
}
