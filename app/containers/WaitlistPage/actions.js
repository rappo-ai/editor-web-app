/*
 *
 * WaitlistPage actions
 *
 */

import {
  UPDATE_USER_PROFILE,
  UPDATE_USER_PROFILE_SUCCESS,
  UPDATE_USER_PROFILE_ERROR,
} from './constants';

export function updateUserProfile({
  accessToken,
  phoneNumber,
  linkedinUrl,
  useCase,
}) {
  return {
    type: UPDATE_USER_PROFILE,
    accessToken,
    phoneNumber,
    linkedinUrl,
    useCase,
  };
}

export function updateUserProfileSuccess(profile) {
  return {
    type: UPDATE_USER_PROFILE_SUCCESS,
    profile,
  };
}

export function updateUserProfileError(error) {
  return {
    type: UPDATE_USER_PROFILE_ERROR,
    error,
  };
}
