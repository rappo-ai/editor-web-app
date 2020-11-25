import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import apiBuilder from 'utils/api';
import request from 'utils/request';

/**
 * Create a new bot model
 */
function* createBotModel(action) {
  const { url, options } = apiBuilder(`/model`, {
    body: { botId: action.botId },
    method: 'POST',
  });
  const response = yield call(request, url, options);
  if (response.model) {
    yield put({
      type: 'CREATE_BOT_MODEL_SUCCESS',
      model: response.model,
    });
  }
}

/**
 * Load bot model from id
 */
function* loadBotModel(action) {
  try {
    const { url, options } = apiBuilder(`/bot/${action.botId}/model`);
    const response = yield call(request, url, options);
    if (response.models) {
      if (response.models.length) {
        yield put({
          type: 'LOAD_BOT_MODEL_SUCCESS',
          model: response.models[0],
        });
      } else if (action.createIfNone) {
        yield put({ type: 'CREATE_BOT_MODEL', botId: action.botId });
      }
    }
  } catch (err) {
    console.error(err);
    yield put({
      type: 'LOAD_BOT_MODEL_ERROR',
      error: err,
    });
  }
}

// Individual exports for testing
export default function* botEditorPageSaga() {
  yield all([
    yield takeLatest('LOAD_BOT_MODEL', loadBotModel),
    yield takeEvery('CREATE_BOT_MODEL', createBotModel),
  ]);
}
