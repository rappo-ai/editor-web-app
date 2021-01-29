/*
 *
 * WaitlistPage actions
 *
 */

import {
  UPDATE_USER_PROFILE,
  UPDATE_USER_PROFILE_SUCCESS,
  UPDATE_USER_PROFILE_ERROR,
} from '../App/constants';

export function updateUserProfile({ accessToken, profileName, data }) {
  return {
    type: UPDATE_USER_PROFILE,
    accessToken,
    profileName,
    data,
  };
}

export function updateUserProfileSuccess(user) {
  return {
    type: UPDATE_USER_PROFILE_SUCCESS,
    user,
  };
}

export function updateUserProfileError(error) {
  return {
    type: UPDATE_USER_PROFILE_ERROR,
    error,
  };
}
