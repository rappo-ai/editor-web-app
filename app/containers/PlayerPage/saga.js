import { all, call, put, takeEvery } from 'redux-saga/effects';
import { has as hasObjectProperty } from 'lodash/object';

import apiBuilder from 'utils/api';
import request from 'utils/request';

/**
 * Load a bot from id
 */
function* loadPlayerBot(action) {
  try {
    const { url, options } = apiBuilder(`/bots/${action.botId}`, {
      accessToken: action.accessToken,
    });
    // Call our request helper (see 'utils/request')
    const response = yield call(request, url, options);
    yield put({
      type: 'LOAD_PLAYER_BOT_SUCCESS',
      bot: response.bot,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: 'LOAD_PLAYER_BOT_ERROR',
      error: err,
    });
  }
}

/**
 * Load bot user from botUserAccessToken
 */
function* loadBotUser(action) {
  try {
    const { url, options } = apiBuilder(`/users/me`, {
      accessToken: action.botUserAccessToken,
    });
    const response = yield call(request, url, options);
    const botUser = response.user;
    yield put({
      type: 'LOAD_BOT_USER_SUCCESS',
      botUser,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: 'LOAD_BOT_USER_ERROR',
      error: err,
    });
  }
}

/**
 * Load end user
 */
function* loadEndUser(action) {
  try {
    let endUser = null;
    let isExistingUser = true;
    let { url, options } = apiBuilder(
      `/users?ownerId=${action.botUser.id}&userKey=${action.userKey}`,
      {
        accessToken: action.botUserAccessToken,
      },
    );
    let response = yield call(request, url, options);
    if (!hasObjectProperty(response, 'data.users[0]')) {
      ({ url, options } = apiBuilder(`/users`, {
        accessToken: action.botUserAccessToken,
        body: {
          ownerId: action.botUser.id,
          botId: action.botId,
          userKey: action.userKey,
        },
        method: 'POST',
      }));
      response = yield call(request, url, options);
      endUser = Object.assign({}, response.data.user);
      isExistingUser = false;
    } else {
      endUser = Object.assign({}, response.data.users[0]);
    }

    ({ url, options } = apiBuilder(`/users/${endUser.id}/endusertokens`, {
      accessToken: action.botUserAccessToken,
      method: 'POST',
    }));
    response = yield call(request, url, options);

    endUser.accessToken = response.data.accessToken;
    yield put({
      type: 'LOAD_END_USER_SUCCESS',
      endUser,
      isExistingUser,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: 'LOAD_END_USER_ERROR',
      error: err,
    });
  }
}

/**
 * Load bot model from id
 */
function* loadBotModel(action) {
  try {
    const { url, options } = apiBuilder(`/bots/${action.botId}/models`, {
      accessToken: action.accessToken,
    });
    const response = yield call(request, url, options);
    if (response.models && response.models.length) {
      yield put({
        type: 'LOAD_BOT_MODEL_SUCCESS',
        model: response.models[0],
      });
    }
  } catch (err) {
    console.error(err);
    yield put({
      type: 'LOAD_BOT_MODEL_ERROR',
      error: err,
    });
  }
}

/**
 * Transition to the next state
 */
function* doTransitionToState(action) {
  let response;
  try {
    const { url, options } = apiBuilder(
      `/models/${action.modelId}/states?fromStateId=${
        action.fromStateId
      }&transitionEventType=\
${action.event.type}&transitionEventValue=${encodeURIComponent(
        action.event.value,
      )}`,
      {
        accessToken: action.accessToken,
      },
    );
    response = yield call(request, url, options);
    if (response.state) {
      yield put({
        type: 'DO_TRANSITION_TO_STATE_SUCCESS',
        state: response.state,
        modelId: action.modelId,
      });
    } else {
      yield put({
        type: 'DO_TRANSITION_TO_STATE_ERROR',
        error: response,
      });
    }
  } catch (err) {
    console.error(err);
    yield put({
      type: 'DO_TRANSITION_TO_STATE_ERROR',
      error: err,
    });
    response = err;
  }
  return response;
}

// Individual exports for testing
export default function* playerPageSaga() {
  yield all([
    yield takeEvery('LOAD_PLAYER_BOT', loadPlayerBot),
    yield takeEvery('LOAD_BOT_USER', loadBotUser),
    yield takeEvery('LOAD_END_USER', loadEndUser),
    yield takeEvery('LOAD_BOT_MODEL', loadBotModel),
    yield takeEvery('DO_TRANSITION_TO_STATE', doTransitionToState),
  ]);
}
