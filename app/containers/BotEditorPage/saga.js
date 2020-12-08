import { all, call, put, takeEvery } from 'redux-saga/effects';
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

/**
 * Add a new state
 */
function* addState(action) {
  let response;
  try {
    const { url, options } = apiBuilder(`/model/${action.modelId}/state`, {
      method: 'POST',
      body: {
        message: action.message,
        responses: action.responses,
      },
    });
    response = yield call(request, url, options);
    if (response.model) {
      yield put({
        type: 'ADD_STATE_SUCCESS',
        model: response.model,
        state: response.state,
      });
    }
  } catch (err) {
    console.error(err);
    yield put({
      type: 'ADD_STATE_ERROR',
      error: err,
    });
    response = err;
  }
  return response;
}

/**
 * Update an existing state
 */
function* updateState(action) {
  let response;
  try {
    const { url, options } = apiBuilder(
      `/model/${action.modelId}/state/${action.stateId}`,
      {
        method: 'PUT',
        body: {
          message: action.message,
          responses: action.responses,
        },
      },
    );
    response = yield call(request, url, options);
    if (response.model) {
      yield put({
        type: 'UPDATE_STATE_SUCCESS',
        model: response.model,
        state: response.state,
      });
    }
  } catch (err) {
    console.error(err);
    yield put({
      type: 'UPDATE_STATE_ERROR',
      error: err,
    });
    response = err;
  }
  return response;
}

/**
 * Delete a state (and all transitions from / to this state).
 */
function* deleteState(action) {
  let response;
  try {
    const { url, options } = apiBuilder(
      `/model/${action.modelId}/state/${action.stateId}`,
      {
        method: 'DELETE',
      },
    );
    response = yield call(request, url, options);
    if (response.model) {
      yield put({
        type: 'DELETE_STATE_SUCCESS',
        model: response.model,
        stateId: response.stateId,
      });
    }
  } catch (err) {
    console.error(err);
    yield put({
      type: 'DELETE_STATE_ERROR',
      error: err,
    });
    response = err;
  }
  return response;
}

/**
 * Add a new transition
 */
function* addTransition(action) {
  let response;
  try {
    const { url, options } = apiBuilder(`/model/${action.modelId}/transition`, {
      method: 'POST',
      body: {
        fromStateId: action.fromStateId,
        toStateId: action.toStateId,
        event: action.event,
      },
    });
    response = yield call(request, url, options);
    if (response.model) {
      yield put({
        type: 'ADD_TRANSITION_SUCCESS',
        model: response.model,
        transition: response.transition,
      });
    }
  } catch (err) {
    console.error(err);
    yield put({
      type: 'ADD_TRANSITION_ERROR',
      error: err,
    });
    response = err;
  }
  return response;
}

/**
 * Delete a transition (detach state)
 */
function* deleteTransition(action) {
  let response;
  try {
    const { url, options } = apiBuilder(
      `/model/${action.modelId}/transition/${action.transitionId}`,
      {
        method: 'DELETE',
      },
    );
    response = yield call(request, url, options);
    if (response.model) {
      yield put({
        type: 'DELETE_TRANSITION_SUCCESS',
        model: response.model,
        transitionId: response.transitionId,
      });
    }
  } catch (err) {
    console.error(err);
    yield put({
      type: 'DELETE_TRANSITION_ERROR',
      error: err,
    });
    response = err;
  }
  return response;
}

/**
 * Transition to the next state
 */
function* doTransitionToState(action) {
  let response;
  try {
    const { url, options } = apiBuilder(
      `/model/${action.modelId}/state?fromStateId=${action.fromStateId}&event=\
${action.event}`,
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

/**
 * Add a new state and a transition to this state.
 */
function* addStateWithTransition(action) {
  try {
    const { state: existingState } = yield call(doTransitionToState, {
      type: 'DO_TRANSITION_TO_STATE',
      modelId: action.modelId,
      fromStateId: action.fromStateId,
      event: action.event,
    });
    if (existingState) {
      return;
    }
    const { state } = yield call(addState, {
      type: 'ADD_STATE',
      message: action.message,
      responses: action.responses,
      modelId: action.modelId,
    });
    // eslint-disable-next-line no-unused-vars
    const { transition, model } = yield call(addTransition, {
      type: 'ADD_TRANSITION',
      fromStateId: action.fromStateId,
      toStateId: state.id,
      event: action.event,
      modelId: action.modelId,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: 'ADD_STATE_WITH_TRANSITION_ERROR',
      error: err,
    });
  }
}

// Individual exports for testing
export default function* botEditorPageSaga() {
  yield all([
    yield takeEvery('LOAD_BOT_MODEL', loadBotModel),
    yield takeEvery('CREATE_BOT_MODEL', createBotModel),
    yield takeEvery('ADD_STATE', addState),
    yield takeEvery('UPDATE_STATE', updateState),
    yield takeEvery('DELETE_STATE', deleteState),
    yield takeEvery('ADD_TRANSITION', addTransition),
    yield takeEvery('DELETE_TRANSITION', deleteTransition),
    yield takeEvery('DO_TRANSITION_TO_STATE', doTransitionToState),
    yield takeEvery('ADD_STATE_WITH_TRANSITION', addStateWithTransition),
  ]);
}
