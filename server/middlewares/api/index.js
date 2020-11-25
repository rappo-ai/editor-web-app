const express = require('express');
const { nanoid } = require('nanoid');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const db = require('../../db');
const router = express.Router();

passport.use(
  new BearerStrategy(async function(token, done) {
    const mytoken = await db.get('accesstoken', {
      property: 'value',
      value: token,
    });
    const user = mytoken ? await db.get('user', mytoken.userid) : null;
    if (!user) {
      return done(null, false);
    }
    return done(null, user, { scope: '*' });
  }),
);

router.use(
  passport.authenticate('bearer', { session: false }),
  (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401);
    return res.end();
  },
);

router.get('/userinfo', async (req, res) => {
  const { user } = req;
  if (!user || !user.id) {
    res.status(500);
    return res.end();
  }
  const googleUser = await db.get('googleuser', {
    property: 'userid',
    value: user.id,
  });
  return res.json({
    ...user,
    googleProfile: googleUser,
  });
});

router.get('/bot', async (req, res) => {
  const { user } = req;
  if (!user || !user.id) {
    res.status(500);
    return res.end();
  }
  const bots = await db.query('bot', {
    property: 'userid',
    value: user.id,
  });
  return res.json({
    bots,
  });
});

router.post('/bot', async (req, res) => {
  const { user } = req;
  if (!user || !user.id) {
    res.status(500);
    return res.end();
  }
  const name = req.body.name || 'Untitled bot';
  const bot = await db.create('bot');
  await bot.set('userid', user.id);
  await bot.set('name', name);
  return res.json({
    bot,
  });
});

router.get('/bot/:id', async (req, res) => {
  const { user } = req;
  if (!user || !user.id) {
    res.status(500);
    return res.end();
  }
  const bot = await db.get('bot', {
    property: 'id',
    value: req.params.id,
  });
  return res.json({
    bot,
  });
});

router.get('/bot/:id/model', async (req, res) => {
  const { user } = req;
  if (!user || !user.id) {
    res.status(500);
    return res.end();
  }
  const models = await db.query('model', {
    property: 'botid',
    value: req.params.id,
  });
  return res.json({
    models,
  });
});

router.post('/model', async (req, res) => {
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

router.get('/model/:id', async (req, res) => {
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

router.post('/model/:id/state', async (req, res) => {
  const { user } = req;
  const { message, senderId } = req.body;
  if (!user || !user.id || !message || !senderId) {
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
    senderId,
  };
  model.states.push(state);
  await model.set('states', model.states);
  return res.json({
    model,
  });
});

router.post('/model/:id/transition', async (req, res) => {
  const { user } = req;
  const { fromStateId, toStateId, event } = req.body;
  if (
    !user ||
    !user.id ||
    !fromStateId ||
    !toStateId ||
    (!event && event !== '')
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
  });
});

router.get('/model/:id/state', async (req, res) => {
  const { user } = req;
  const { fromStateId, event } = req.body;
  if (!user || !user.id || !fromStateId || (!event && event !== '')) {
    res.status(500);
    return res.end();
  }
  const model = await db.get('model', {
    property: 'id',
    value: req.params.id,
  });
  const transition = model.transitions.find(
    e => e.fromStateId === fromStateId && e.event === event,
  );
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
  });
});

module.exports = router;
