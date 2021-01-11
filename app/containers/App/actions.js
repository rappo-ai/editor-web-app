/*
 * App Actions
 */

import {
  LOAD_COOKIES,
  LOAD_COOKIES_SUCCESS,
  LOAD_USER,
  LOAD_USER_SUCCESS,
  LOAD_USER_ERROR,
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
 * Load user
 *
 * @return {object} An action object with a type of LOAD_USER
 */
export function loadUser(accessToken, isEndUser, endUserId) {
  return {
    type: LOAD_USER,
    accessToken,
    isEndUser,
    endUserId,
  };
}

/**
 * Dispatched when the user profile is loaded by the request saga
 *
 * @param  {object} profile The user profile data
 * @param  {boolean} isActivated true if user is activated, false otherwise
 *
 * @return {object}      An action object with a type of LOAD_USER_SUCCESS passing the user data
 */
export function userLoaded(profile, isActivated) {
  return {
    type: LOAD_USER_SUCCESS,
    profile,
    isActivated,
  };
}

/**
 * Dispatched when loading the user fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of LOAD_USER_ERROR passing the error
 */
export function userLoadError(error) {
  return {
    type: LOAD_USER_ERROR,
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
