const express = require('express');
const { nanoid } = require('nanoid');
const db = require('../../../../db');
const {
  API_ERROR_RESPONSE,
  API_SUCCESS_RESPONSE,
  API_THROW_ERROR,
  API_VALIDATE_QUERY_PARAMETERS,
  API_VALIDATE_REQUEST_BODY_PARAMETERS,
} = require('../../../../utils/api');
const { getNextState } = require('../../../../utils/bot');
const router = express.Router();

router.post('/', async (req, res) => {
  const { user } = req;
  const { botId } = req.body;

  API_VALIDATE_REQUEST_BODY_PARAMETERS({ botId });

  const model = await db.create('model');
  await model.set('userid', user.id);
  await model.set('botid', botId);
  await model.set('states', []);
  await model.set('transitions', []);

  return res.json(API_SUCCESS_RESPONSE(model));
});

router.get('/:id', async (req, res) => {
  const model = await db.get('model', {
    property: 'id',
    value: req.params.id,
  });

  return res.json(API_SUCCESS_RESPONSE(model));
});

router.post('/:id/state', async (req, res) => {
  const { message, responses } = req.body;

  API_VALIDATE_REQUEST_BODY_PARAMETERS({ message, responses });

  const model = await db.get('model', {
    property: 'id',
    value: req.params.id,
  });
  const state = {
    id: nanoid(),
    message,
    responses,
  };
  model.states.push(state);
  await model.set('states', model.states);

  return res.json(
    API_SUCCESS_RESPONSE({
      model,
      state,
    }),
  );
});

router.put('/:id/state/:stateId', async (req, res) => {
  const { message, responses } = req.body;

  API_VALIDATE_REQUEST_BODY_PARAMETERS({ message, responses });

  const model = await db.get('model', {
    property: 'id',
    value: req.params.id,
  });
  API_THROW_ERROR(!model, 400, 'Model not found');

  const state = model.states.find(e => e.id === req.params.stateId);
  API_THROW_ERROR(!state, 400, 'State not found');

  state.message = message;
  state.responses = responses;
  await model.set('states', model.states);

  return res.json(
    API_SUCCESS_RESPONSE({
      model,
      state,
    }),
  );
});

router.delete('/:id/state/:stateId', async (req, res) => {
  const model = await db.get('model', {
    property: 'id',
    value: req.params.id,
  });
  API_THROW_ERROR(!model, 400, 'Model not found');

  model.states = model.states.filter(e => e.id !== req.params.stateId);
  await model.set('states', model.states);

  return res.json(
    API_SUCCESS_RESPONSE({
      model,
      stateId: req.params.stateId,
    }),
  );
});

router.post('/:id/transition', async (req, res) => {
  const { fromStateId, toStateId, event } = req.body;

  API_VALIDATE_REQUEST_BODY_PARAMETERS({ fromStateId, toStateId, event });

  API_THROW_ERROR(!event.type, 400, 'Missing event type');
  API_THROW_ERROR(
    !event.value && event.value !== '',
    400,
    'Missing event value',
  );

  const model = await db.get('model', {
    property: 'id',
    value: req.params.id,
  });
  API_THROW_ERROR(!model, 400, 'Model not found');

  const transition = {
    id: nanoid(),
    fromStateId,
    toStateId,
    event,
  };
  model.transitions.push(transition);
  await model.set('transitions', model.transitions);
  return res.json(
    API_SUCCESS_RESPONSE({
      model,
      transition,
    }),
  );
});

router.delete('/:id/transition/:transitionId', async (req, res) => {
  const model = await db.get('model', {
    property: 'id',
    value: req.params.id,
  });
  API_THROW_ERROR(!model, 400, 'Model not found');

  model.transitions = model.transitions.filter(
    e => e.id !== req.params.transitionId,
  );
  await model.set('transitions', model.transitions);
  return res.json(
    API_SUCCESS_RESPONSE({
      model,
      transitionId: req.params.transitionId,
    }),
  );
});

router.get('/:id/state', async (req, res) => {
  const { fromStateId, transitionEventType, transitionEventValue } = req.query;
  API_VALIDATE_QUERY_PARAMETERS({
    fromStateId,
    transitionEventType,
    transitionEventValue,
  });

  const model = await db.get('model', {
    property: 'id',
    value: req.params.id,
  });
  API_THROW_ERROR(!model, 400, 'Model not found');

  const getNextStateResponse = getNextState(
    model,
    fromStateId,
    transitionEventType,
    transitionEventValue,
  );

  if (!getNextStateResponse.transition) {
    return res.json(
      API_ERROR_RESPONSE({
        error: 'TRANSITION_NOT_FOUND',
      }),
    );
  }
  if (!getNextStateResponse.state) {
    return res.json(
      API_ERROR_RESPONSE({
        error: 'STATE_NOT_FOUND',
      }),
    );
  }
  return res.json(
    API_SUCCESS_RESPONSE({
      state: getNextStateResponse.state,
      isCatchAll: getNextStateResponse.isCatchAll,
    }),
  );
});

module.exports = router;
