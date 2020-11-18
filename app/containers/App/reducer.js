/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import {
  LOAD_COOKIES,
  LOAD_COOKIES_SUCCESS,
  LOAD_USER_PROFILE,
  LOAD_USER_PROFILE_SUCCESS,
  LOAD_USER_PROFILE_ERROR,
} from './constants';

// The initial state of the App
export const initialState = {
  loading: false,
  error: false,
  cookies: {
    at: '',
  },
  session: {
    isLoggedIn: false,
  },
  header: {
    title: 'Bots',
    avatarImage: '',
    menuItems: [],
    actionsButtons: [],
  },
  user: {
    profile: {
      displayName: '',
      profilePic: '',
    },
  },
  bots: false,
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_COOKIES:
        draft.loading = true;
        draft.error = false;
        draft.cookies = initialState.cookies;
        break;

      case LOAD_COOKIES_SUCCESS:
        draft.cookies = action.cookies;
        draft.loading = false;
        break;

      case LOAD_USER_PROFILE:
        draft.loading = true;
        draft.error = false;
        draft.session.isLoggedIn = initialState.session.isLoggedIn;
        draft.user.profile = initialState.user.profile;
        break;

      case LOAD_USER_PROFILE_SUCCESS:
        draft.session.isLoggedIn = true;
        draft.user.profile = action.profile;
        draft.loading = false;
        break;

      case LOAD_USER_PROFILE_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      case 'LOAD_BOTS':
        draft.loading = true;
        draft.error = false;
        break;

      case 'LOAD_BOTS_SUCCESS':
        draft.loading = false;
        draft.bots = action.bots;
        break;

      case 'LOAD_BOTS_ERROR':
        draft.loading = false;
        draft.error = action.error;
        break;

      case 'CREATE_BOT':
        draft.loading = true;
        draft.error = false;
        break;

      case 'CREATE_BOT_SUCCESS':
        draft.loading = false;
        if (draft.bots) {
          draft.bots.push(action.bot);
        } else {
          draft.bots = [action.bot];
        }
        break;

      case 'CREATE_BOT_ERROR':
        draft.loading = false;
        draft.error = action.error;
        break;

      case 'SETUP_HEADER':
        draft.header.title = action.payload.title;
        draft.header.avatarImage = action.payload.avatarImage;
        draft.header.menuItems = action.payload.menuItems;
        draft.header.actionsButtons = action.payload.actionButtons;
    }
  });

export default appReducer;
