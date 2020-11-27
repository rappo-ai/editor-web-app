/*
 *
 * BotEditorPage reducer
 *
 */
import produce from 'immer';

export const initialState = {
  model: {},
  chatHistory: [{ state: { id: 'START' }, transitionEvent: '' }],
};

/* eslint-disable default-case, no-param-reassign */
const botEditorPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case 'CREATE_BOT_MODEL_SUCCESS':
        draft.model = action.model;
        break;
      case 'LOAD_BOT_MODEL_SUCCESS':
        draft.model = action.model;
        break;
      case 'SET_TRANSITION_EVENT':
        draft.chatHistory[draft.chatHistory.length - 1].transitionEvent =
          action.event;
        break;
      case 'ADD_STATE_SUCCESS':
        draft.chatHistory.push({ state: action.state, transitionEvent: '' });
        draft.model = action.model;
        break;
      case 'ADD_TRANSITION_SUCCESS':
        draft.model = action.model;
        break;
      case 'DO_TRANSITION_TO_STATE_SUCCESS':
        draft.chatHistory.push({ state: action.state, transitionEvent: '' });
        break;
    }
  });

export default botEditorPageReducer;
