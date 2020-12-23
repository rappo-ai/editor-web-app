import { all, call, put, takeEvery } from 'redux-saga/effects';
import apiBuilder from 'utils/api';
import request from 'utils/request';

/**
 * Load a bot from id
 */
function* loadPlayerBot(action) {
  try {
    const { url, options } = apiBuilder(`/bot/${action.botId}`, {
      accessToken: action.accessToken,
    });
    // Call our request helper (see 'utils/request')
    const response = yield call(request, url, options);
    console.log('loadPlayerBot response');
    console.log(response);
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
 * Load bot model from id
 */
function* loadBotModel(action) {
  try {
    const { url, options } = apiBuilder(`/bot/${action.botId}/model`, {
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
      `/model/${action.modelId}/state?fromStateId=${
        action.fromStateId
      }&transitionEventType=\
${action.event.type}&transitionEventValue=${action.event.value}`,
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
    yield takeEvery('LOAD_BOT_MODEL', loadBotModel),
    yield takeEvery('DO_TRANSITION_TO_STATE', doTransitionToState),
  ]);
}
