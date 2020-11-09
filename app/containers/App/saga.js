/**
 * Gets the repositories of the user from Github
 */

import { call, put, select, takeLatest, all } from 'redux-saga/effects';
import request from 'utils/request';
import Cookies from 'js-cookie';
import { LOAD_COOKIES, LOAD_USER_PROFILE } from './constants';
import {
  cookiesLoaded,
  userProfileLoaded,
  userProfileLoadError,
} from './actions';

import { makeSelectCookies } from './selectors';

/**
 * Read cookies and store the state
 */
export function* loadCookies() {
  const cookies = Cookies.get();
  yield put(cookiesLoaded(cookies));
}

/**
 * Load the user profile if logged in
 */
export function* loadUserProfile() {
  const cookies = yield select(makeSelectCookies());
  const domain = 'http://localhost:3000'; // 'https://rappo.ai';
  const apiPrefix = '/api';
  const apiEndpoint = '/userinfo';
  const requestURL = `${domain}${apiPrefix}${apiEndpoint}`;
  const requestOptions = {
    headers: {
      Authorization: `Bearer ${cookies.at}`,
      'Cache-Control': 'no-cache',
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
    },
  };
  try {
    // Call our request helper (see 'utils/request')
    const response = yield call(request, requestURL, requestOptions);
    const profile = { displayName: '', profilePic: '' };
    if (response.googleProfile) {
      profile.displayName = response.googleProfile.profile.displayName;
      profile.profilePic = response.googleProfile.profile.photos[0].value;
    }
    yield put(userProfileLoaded(profile));
  } catch (err) {
    yield put(userProfileLoadError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* rootSaga() {
  yield all([
    yield takeLatest(LOAD_COOKIES, loadCookies),
    yield takeLatest(LOAD_USER_PROFILE, loadUserProfile),
  ]);
}
