/**
 * Gets the repositories of the user from Github
 */

import { call, put, takeLatest, all } from 'redux-saga/effects';
import apiBuilder from 'utils/api';
import history from 'utils/history';
import request from 'utils/request';
import Cookies from 'js-cookie';
import { LOAD_COOKIES, LOAD_USER } from './constants';
import { cookiesLoaded, userLoaded, userLoadError } from './actions';

/**
 * Read cookies and store the state
 */
function* loadCookies() {
  const cookies = Cookies.get();
  yield put(cookiesLoaded(cookies));
}

/**
 * Load the logged in user
 */
function* loadUser(action) {
  try {
    const { url, options } = apiBuilder(`/users/me`, {
      accessToken: action.accessToken,
    });
    // Call our request helper (see 'utils/request')
    const response = yield call(request, url, options);
    yield put(userLoaded(response.user));
  } catch (err) {
    console.error(err);
    yield put(userLoadError(err));
  }
}

/**
 * Load the bots for the logged in user
 */
function* loadBots(action) {
  try {
    const { url, options } = apiBuilder(`/bots`, {
      accessToken: action.accessToken,
    });
    // Call our request helper (see 'utils/request')
    const response = yield call(request, url, options);
    yield put({
      type: 'LOAD_BOTS_SUCCESS',
      bots: response.bots,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: 'LOAD_BOTS_ERROR',
      error: err,
    });
  }
}

/**
 * Create a new bot
 */
function* createBot(action) {
  try {
    const { url, options } = apiBuilder('/bots', {
      method: 'POST',
      body: {
        name: action.name,
      },
      accessToken: action.accessToken,
    });
    // Call our request helper (see 'utils/request')
    const response = yield call(request, url, options);
    yield put({
      type: 'CREATE_BOT_SUCCESS',
      bot: response.bot,
    });

    yield call(history.push, `/edit/bot/${response.bot.id}`);
  } catch (err) {
    console.error(err);
    yield put({
      type: 'CREATE_BOT_ERROR',
      error: err,
    });
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* rootSaga() {
  yield all([
    yield takeLatest(LOAD_COOKIES, loadCookies),
    yield takeLatest(LOAD_USER, loadUser),
    yield takeLatest('LOAD_BOTS', loadBots),
    yield takeLatest('CREATE_BOT', createBot),
  ]);
}
