const express = require('express');
const db = require('../../../../db');
const router = express.Router();

router.get('/', async (req, res) => {
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

router.post('/', async (req, res) => {
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

router.get('/:id', async (req, res) => {
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

router.get('/:id/model', async (req, res) => {
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

router.post('/:botId/publish', async (req, res) => {
  const { user } = req;
  if (!user || !user.id) {
    res.status(500);
    return res.end();
  }

  let botUser = await db.get('user', {
    property: 'botid',
    value: req.params.botId,
  });

  let accessToken;
  if (!botUser) {
    botUser = await db.create('user');
    await botUser.set('botid', req.params.botId);
  } else {
    accessToken = await db.get('accesstoken', {
      property: 'userid',
      value: botUser.id,
    });
  }

  if (!accessToken) {
    accessToken = await db.create('accesstoken');
    await accessToken.set('userid', botUser.id);
    await botUser.set('accesstokenid', accessToken.id);
  }

  return res.json({
    accessToken,
    botId: req.params.botId,
  });
});

module.exports = router;
