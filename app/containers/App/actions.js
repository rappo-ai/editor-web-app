/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  LOAD_COOKIES,
  LOAD_COOKIES_SUCCESS,
  LOAD_USER_PROFILE,
  LOAD_USER_PROFILE_SUCCESS,
  LOAD_USER_PROFILE_ERROR,
} from './constants';

/**
 * Read the cookies
 *
 * @return {object} An action object with a type of LOAD_COOKIES
 */
export function loadCookies() {
  return {
    type: LOAD_COOKIES,
  };
}

/**
 * Dispatched when the cookies are loaded
 *
 * @param  {array} cookies The cookies data
 *
 * @return {object}      An action object with a type of LOAD_COOKIES_SUCCESS passing the cookies
 */
export function cookiesLoaded(cookies) {
  return {
    type: LOAD_COOKIES_SUCCESS,
    cookies,
  };
}

/**
 * Load user profile
 *
 * @return {object} An action object with a type of LOAD_USER_PROFILE
 */
export function loadUserProfile(accessToken, isEndUser, endUserId) {
  return {
    type: LOAD_USER_PROFILE,
    accessToken,
    isEndUser,
    endUserId,
  };
}

/**
 * Dispatched when the user profile is loaded by the request saga
 *
 * @param  {array} profile The user profile data
 *
 * @return {object}      An action object with a type of LOAD_USER_PROFILE_SUCCESS passing the profile
 */
export function userProfileLoaded(profile) {
  return {
    type: LOAD_USER_PROFILE_SUCCESS,
    profile,
  };
}

/**
 * Dispatched when loading the user profile fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of LOAD_USER_PROFILE_ERROR passing the error
 */
export function userProfileLoadError(error) {
  return {
    type: LOAD_USER_PROFILE_ERROR,
    error,
  };
}

/**
 * Loads the user's bots from DB.
 *
 * @return {object} An action object with a type of LOAD_BOTS
 */
export function loadBots(accessToken) {
  return {
    type: 'LOAD_BOTS',
    accessToken,
  };
}

/**
 * Add a new bot to the DB.
 *
 * @return {object} An action object with a type of ADD_BOT
 */
export function createBot(name = 'Untitled ...', accessToken) {
  return {
    type: 'CREATE_BOT',
    name,
    accessToken,
  };
}

/**
 * Loads a bot from DB.
 *
 * @return {object} An action object with a type of LOAD_BOT
 */
export function loadBot(id, accessToken) {
  return {
    type: 'LOAD_BOT',
    id,
    accessToken,
  };
}

/**
 * Setup the header state.
 *
 * @return {object} An action object with a type of LOAD_BOTS
 */
export function setupHeader({
  title = '',
  menuIcon = '',
  menuItems = [],
  actionButtons = [],
  showBackButton = false,
} = {}) {
  return {
    type: 'SETUP_HEADER',
    payload: {
      title,
      menuIcon,
      menuItems,
      actionButtons,
      showBackButton,
    },
  };
}
