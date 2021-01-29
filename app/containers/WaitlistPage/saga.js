import { call, put, takeEvery } from 'redux-saga/effects';
import apiBuilder from 'utils/api';
import request from 'utils/request';
import { updateUserProfileSuccess, updateUserProfileError } from './actions';
import { UPDATE_USER_PROFILE } from '../App/constants';

function* updateUserProfile(action) {
  try {
    const { url, options } = apiBuilder(
      `/users/me/profiles/${action.profileName}`,
      {
        method: 'PUT',
        body: {
          data: action.data,
        },
        accessToken: action.accessToken,
      },
    );
    // Call our request helper (see 'utils/request')
    const user = yield call(request, url, options);
    yield put(updateUserProfileSuccess(user));
  } catch (err) {
    console.error(err);
    yield put(updateUserProfileError(err));
  }
}

export default function* waitlistPageSaga() {
  yield takeEvery(UPDATE_USER_PROFILE, updateUserProfile);
}
