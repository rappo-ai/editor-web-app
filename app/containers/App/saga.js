/**
 * Gets the repositories of the user from Github
 */

import { call, put, takeLatest, all } from 'redux-saga/effects';
import apiBuilder from 'utils/api';
import history from 'utils/history';
import request from 'utils/request';
import Cookies from 'js-cookie';
import { LOAD_COOKIES, LOAD_USER_PROFILE } from './constants';
import {
  cookiesLoaded,
  userProfileLoaded,
  userProfileLoadError,
} from './actions';

/**
 * Read cookies and store the state
 */
function* loadCookies() {
  const cookies = Cookies.get();
  yield put(cookiesLoaded(cookies));
}

/**
 * Load the user profile if logged in
 */
function* loadUserProfile() {
  try {
    const { url, options } = apiBuilder('/userinfo');
    // Call our request helper (see 'utils/request')
    const response = yield call(request, url, options);
    const profile = { displayName: '', profilePic: '' };
    if (response.googleProfile) {
      profile.displayName = response.googleProfile.profile.displayName;
      profile.profilePic = response.googleProfile.profile.photos[0].value;
    }
    yield put(userProfileLoaded(profile));
  } catch (err) {
    console.error(err);
    yield put(userProfileLoadError(err));
  }
}

/**
 * Load the bots for the logged in user
 */
function* loadBots() {
  try {
    const { url, options } = apiBuilder('/bot');
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
    const { url, options } = apiBuilder('/bot', {
      method: 'POST',
      body: {
        name: action.name,
      },
    });
    // Call our request helper (see 'utils/request')
    const response = yield call(request, url, options);
    yield put({
      type: 'CREATE_BOT_SUCCESS',
      bot: response.bot,
    });

    yield call(history.push, `/bot/edit/${response.bot.id}`);
  } catch (err) {
    console.error(err);
    yield put({
      type: 'CREATE_BOT_ERROR',
      error: err,
    });
  }
}

/**
 * Load a bot from id
 */
function* loadBot(action) {
  try {
    const { url, options } = apiBuilder(`/bot/${action.id}`);
    // Call our request helper (see 'utils/request')
    const response = yield call(request, url, options);
    yield put({
      type: 'LOAD_BOT_SUCCESS',
      bot: response.bot,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: 'LOAD_BOT_ERROR',
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
    yield takeLatest(LOAD_USER_PROFILE, loadUserProfile),
    yield takeLatest('LOAD_BOTS', loadBots),
    yield takeLatest('CREATE_BOT', createBot),
    yield takeLatest('LOAD_BOT', loadBot),
  ]);
}
