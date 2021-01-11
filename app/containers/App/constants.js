/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const LOAD_COOKIES = 'rappoweb/App/LOAD_COOKIES';
export const LOAD_COOKIES_SUCCESS = 'rappoweb/App/LOAD_COOKIES_SUCCESS';
export const LOAD_USER = 'rappoweb/App/LOAD_USER';
export const LOAD_USER_SUCCESS = 'rappoweb/App/LOAD_USER_SUCCESS';
export const LOAD_USER_ERROR = 'rappoweb/App/LOAD_USER_ERROR';
