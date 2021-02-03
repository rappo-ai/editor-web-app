/*
 *
 * WaitlistPage reducer
 *
 */
import produce from 'immer';
import {
  UPDATE_USER_PROFILE,
  UPDATE_USER_PROFILE_SUCCESS,
  UPDATE_USER_PROFILE_ERROR,
} from '../App/constants';

export const initialState = {
  updateStatus: '',
};

/* eslint-disable default-case, no-param-reassign */
const waitlistPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case UPDATE_USER_PROFILE:
        draft.updateStatus = 'updateInProgress';
        break;
      case UPDATE_USER_PROFILE_SUCCESS:
        draft.updateStatus = 'updateSuccess';
        break;
      case UPDATE_USER_PROFILE_ERROR:
        draft.updateStatus = 'updateError';
        break;
    }
  });

export default waitlistPageReducer;
