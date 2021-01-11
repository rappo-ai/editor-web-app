import { call, put, takeEvery } from 'redux-saga/effects';
import apiBuilder from 'utils/api';
import request from 'utils/request';
import { updateUserProfileSuccess, updateUserProfileError } from './actions';
import { UPDATE_USER_PROFILE } from './constants';

function* updateUserProfile(action) {
  try {
    const { url, options } = apiBuilder('/user/profile', {
      method: 'PUT',
      body: {
        profile: {
          linkedinUrl: action.linkedinUrl,
          phoneNumber: action.phoneNumber,
          useCase: action.useCase,
        },
      },
      accessToken: action.accessToken,
    });
    // Call our request helper (see 'utils/request')
    const profile = yield call(request, url, options);
    yield put(updateUserProfileSuccess(profile));
  } catch (err) {
    console.error(err);
    yield put(updateUserProfileError(err));
  }
}

export default function* waitlistPageSaga() {
  yield takeEvery(UPDATE_USER_PROFILE, updateUserProfile);
}
