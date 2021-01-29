/*
 *
 * PlayerPage reducer
 *
 */
import produce from 'immer';

export const initialState = {
  bot: { id: '', name: '' },
  botUser: {},
  endUser: {},
  model: {},
  chatHistory: [
    {
      state: { id: 'START', message: 'START' },
      transitionEvent: { type: 'response', value: '' },
    },
  ],
  transitionInProgress: true,
};

/* eslint-disable default-case, no-param-reassign */
const playerPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case 'LOAD_BOT_MODEL_SUCCESS':
        draft.model = action.model;
        break;
      case 'LOAD_PLAYER_BOT_SUCCESS':
        draft.bot = action.bot;
        break;
      case 'LOAD_BOT_USER_SUCCESS':
        draft.botUser = action.botUser;
        break;
      case 'LOAD_END_USER_SUCCESS':
        draft.endUser = action.endUser;
        break;
      case 'SET_TRANSITION_EVENT':
        if (action.modelId === draft.model.id) {
          draft.chatHistory[draft.chatHistory.length - 1].transitionEvent =
            action.event;
        }
        break;
      case 'DO_TRANSITION_TO_STATE':
        draft.transitionInProgress = true;
        break;
      case 'DO_TRANSITION_TO_STATE_SUCCESS':
        if (action.modelId === draft.model.id) {
          draft.chatHistory.push({
            state: action.state,
            transitionEvent: { type: 'response', value: '' },
          });
        }
        break;
      case 'DO_TRANSITION_TO_STATE_ERROR':
        draft.transitionInProgress = false;
        break;
      case 'CLEAR_CHAT_HISTORY':
        draft.chatHistory = initialState.chatHistory;
        draft.model = initialState.model;
        draft.transitionInProgress = initialState.transitionInProgress;
        break;
    }
  });

export default playerPageReducer;
