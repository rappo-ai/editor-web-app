/*
 *
 * BotEditorPage reducer
 *
 */
import produce from 'immer';

export const initialState = {
  model: {},
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
    }
  });

export default botEditorPageReducer;
