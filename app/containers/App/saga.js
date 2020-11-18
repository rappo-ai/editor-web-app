/**
 * Gets the repositories of the user from Github
 */

import { call, put, select, takeLatest, all } from 'redux-saga/effects';
import history from 'utils/history';
import request from 'utils/request';
import Cookies from 'js-cookie';
import { LOAD_COOKIES, LOAD_USER_PROFILE } from './constants';
import {
  cookiesLoaded,
  userProfileLoaded,
  userProfileLoadError,
} from './actions';

import { makeSelectCookies } from './selectors';

function* apiBuilder(
  apiEndpoint,
  {
    headers = { 'Content-Type': 'application/json' },
    method = 'GET',
    body = false,
  } = {},
) {
  const cookies = yield select(makeSelectCookies());
  const domain = 'http://localhost:3000';
  const apiPrefix = '/api';
  const url = `${domain}${apiPrefix}${apiEndpoint}`;
  const options = {
    headers: {
      Authorization: `Bearer ${cookies.at}`,
      ...headers,
    },
    method,
  };
  if (body) {
    Object.assign(options, {
      body: JSON.stringify(body),
    });
  }
  return {
    url,
    options,
  };
}

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
    const { url, options } = yield call(apiBuilder, '/userinfo');
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
    const { url, options } = yield call(apiBuilder, '/bots');
    // Call our request helper (see 'utils/request')
    const response = yield call(request, url, options);
    yield put({
      type: 'LOAD_BOTS_SUCCESS',
      bots: response.bots,
    });

    if (!response.bots || response.bots.length === 0) {
      yield put({
        type: 'CREATE_BOT',
        name: 'Untitled bot ...',
      });
    }
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
    const { url, options } = yield call(apiBuilder, '/bots', {
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

    yield call(history.push, `/bots/${response.bot.id}`);
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
    yield takeLatest(LOAD_USER_PROFILE, loadUserProfile),
    yield takeLatest('LOAD_BOTS', loadBots),
    yield takeLatest('CREATE_BOT', createBot),
  ]);
}
