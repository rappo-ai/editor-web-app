/*
 *
 * EditorPage reducer
 *
 */
import produce from 'immer';

export const initialState = {
  model: {},
  chatHistory: [
    {
      state: { id: 'START', message: 'START' },
      transitionEvent: { type: 'response', value: '' },
    },
  ],
  transitionInProgress: true,
  publishUrl: '',
};

/* eslint-disable default-case, no-param-reassign */
const editorPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case 'CREATE_BOT_MODEL_SUCCESS':
        draft.model = action.model;
        break;
      case 'LOAD_BOT_MODEL_SUCCESS':
        draft.model = action.model;
        break;
      case 'SET_TRANSITION_EVENT':
        if (action.modelId === draft.model.id) {
          draft.chatHistory[draft.chatHistory.length - 1].transitionEvent =
            action.event;
        }
        break;
      case 'ADD_STATE_SUCCESS':
        if (action.model.id === draft.model.id) {
          draft.chatHistory.push({
            state: action.state,
            transitionEvent: { type: 'response', value: '' },
          });
          draft.model = action.model;
        }
        break;
      case 'UPDATE_STATE_SUCCESS':
        draft.chatHistory = draft.chatHistory.map(e => {
          if (e.state.id === action.state.id) {
            return {
              state: action.state,
              transitionEvent: e.transitionEvent,
            };
          }
          return e;
        });
        draft.model = action.model;
        break;
      case 'DELETE_STATE_SUCCESS':
        // tbd - chatHistory filtering
        draft.model = action.model;
        break;
      case 'ADD_TRANSITION_SUCCESS':
        if (action.model.id === draft.model.id) {
          draft.model = action.model;
        }
        break;
      case 'DELETE_TRANSITION_SUCCESS':
        {
          const deletedTransition = draft.model.transitions.find(
            t => t.id === action.transitionId,
          );
          draft.chatHistory = draft.chatHistory.reduce((a, e) => {
            const lastMessage = a.length && a[a.length - 1];
            if (
              lastMessage &&
              lastMessage.state.id === deletedTransition.fromStateId &&
              lastMessage.transitionEvent.type ===
                deletedTransition.event.type &&
              lastMessage.transitionEvent.value ===
                deletedTransition.event.value
            ) {
              return a;
            }
            a.push(e);
            return a;
          }, []);
          draft.chatHistory[draft.chatHistory.length - 1].transitionEvent = '';
          draft.model = action.model;
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
        draft = initialState;
        break;
      case 'PUBLISH_BOT':
        draft.publishUrl = '';
        break;
      case 'PUBLISH_BOT_SUCCESS':
        draft.publishUrl = `${window.location.origin}/play/bot/${
          action.botId
        }?accessToken=${action.accessToken.value}`;
        break;
      case 'PUBLISH_BOT_ERROR':
        draft.publishUrl = '';
        break;
      default:
        break;
    }
  });

export default editorPageReducer;
