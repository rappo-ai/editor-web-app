const express = require('express');
const { nanoid } = require('nanoid');
const db = require('../../../../db');
const router = express.Router();

router.post('/', async (req, res) => {
  const { user } = req;
  const { botId } = req.body;
  if (!user || !user.id || !botId) {
    res.status(500);
    return res.end();
  }
  const model = await db.create('model');
  await model.set('userid', user.id);
  await model.set('botid', botId);
  await model.set('states', []);
  await model.set('transitions', []);
  return res.json({
    model,
  });
});

router.get('/:id', async (req, res) => {
  const { user } = req;
  if (!user || !user.id) {
    res.status(500);
    return res.end();
  }
  const model = await db.get('model', {
    property: 'id',
    value: req.params.id,
  });
  return res.json({
    model,
  });
});

router.post('/:id/state', async (req, res) => {
  const { user } = req;
  const { message, responses } = req.body;
  if (!user || !user.id || !message || !responses) {
    res.status(500);
    return res.end();
  }
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
  return res.json({
    model,
    state,
  });
});

router.put('/:id/state/:stateId', async (req, res) => {
  const { user } = req;
  const { message, responses } = req.body;
  if (!user || !user.id || !message || !responses) {
    res.status(500);
    return res.end();
  }
  const model = await db.get('model', {
    property: 'id',
    value: req.params.id,
  });
  const state = model.states.find(e => e.id === req.params.stateId);
  state.message = message;
  state.responses = responses;
  await model.set('states', model.states);
  return res.json({
    model,
    state,
  });
});

router.delete('/:id/state/:stateId', async (req, res) => {
  const { user } = req;
  if (!user || !user.id) {
    res.status(500);
    return res.end();
  }
  const model = await db.get('model', {
    property: 'id',
    value: req.params.id,
  });
  model.states = model.states.filter(e => e.id !== req.params.stateId);
  await model.set('states', model.states);
  return res.json({
    model,
    stateId: req.params.stateId,
  });
});

router.post('/:id/transition', async (req, res) => {
  const { user } = req;
  const { fromStateId, toStateId, event } = req.body;
  if (
    !user ||
    !user.id ||
    !fromStateId ||
    !toStateId ||
    !event ||
    !event.type ||
    (!event.value && event.value !== '')
  ) {
    res.status(500);
    return res.end();
  }
  const model = await db.get('model', {
    property: 'id',
    value: req.params.id,
  });
  const transition = {
    id: nanoid(),
    fromStateId,
    toStateId,
    event,
  };
  model.transitions.push(transition);
  await model.set('transitions', model.transitions);
  return res.json({
    model,
    transition,
  });
});

router.delete('/:id/transition/:transitionId', async (req, res) => {
  const { user } = req;
  if (!user || !user.id) {
    res.status(500);
    return res.end();
  }
  const model = await db.get('model', {
    property: 'id',
    value: req.params.id,
  });
  model.transitions = model.transitions.filter(
    e => e.id !== req.params.transitionId,
  );
  await model.set('transitions', model.transitions);
  return res.json({
    model,
    transitionId: req.params.transitionId,
  });
});

router.get('/:id/state', async (req, res) => {
  const { user } = req;
  const { fromStateId, transitionEventType, transitionEventValue } = req.query;
  if (
    !user ||
    !user.id ||
    !fromStateId ||
    !transitionEventType ||
    (!transitionEventValue && transitionEventValue !== '')
  ) {
    res.status(500);
    return res.end();
  }
  const model = await db.get('model', {
    property: 'id',
    value: req.params.id,
  });
  let isCatchAll = false;
  let transition = model.transitions.find(
    e =>
      e.fromStateId === fromStateId &&
      e.event.type === transitionEventType &&
      e.event.value === transitionEventValue,
  );
  if (!transition) {
    // direct transition not found, looking for catch-all
    isCatchAll = true;
    transition =
      transitionEventValue !== '' &&
      model.transitions.find(
        e =>
          e.fromStateId === fromStateId &&
          e.event.type === 'filter' &&
          e.event.value === '*',
      );
  }
  if (!transition) {
    return res.json({
      error: 'TRANSITION_NOT_FOUND',
    });
  }
  const state = model.states.find(e => e.id === transition.toStateId);
  if (!state) {
    return res.json({
      error: 'STATE_NOT_FOUND',
    });
  }
  return res.json({
    state,
    isCatchAll,
  });
});

module.exports = router;
