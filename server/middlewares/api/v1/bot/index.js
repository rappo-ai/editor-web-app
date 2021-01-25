const express = require('express');
const db = require('../../../../db');
const {
  API_THROW_ERROR,
  API_SUCCESS_RESPONSE,
  asyncHandler,
} = require('../../../../utils/api');
const { publishRuntime, unpublishRuntime } = require('../../../../runtimes');
const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { user } = req;

    const bots = await db.query('bot', {
      property: 'userid',
      value: user.id,
    });

    return res.json(API_SUCCESS_RESPONSE({ bots }));
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { user } = req;

    const name = req.body.name || 'Untitled bot';
    const bot = await db.create('bot');
    await bot.set('userid', user.id);
    await bot.set('name', name);

    return res.json(API_SUCCESS_RESPONSE({ bot }));
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const bot = await db.get('bot', {
      property: 'id',
      value: req.params.id,
    });

    return res.json(API_SUCCESS_RESPONSE({ bot }));
  }),
);

router.get(
  '/:id/model',
  asyncHandler(async (req, res) => {
    const models = await db.query('model', {
      property: 'botid',
      value: req.params.id,
    });

    return res.json(API_SUCCESS_RESPONSE({ models }));
  }),
);

router.post(
  '/:botId/publish/:runtime',
  asyncHandler(async (req, res) => {
    const bot = await db.get('bot', {
      property: 'id',
      value: req.params.botId,
    });

    API_THROW_ERROR(!bot, 400, 'Bot not found');

    const publishResponse = await publishRuntime(
      bot,
      req.params.runtime,
      req.body,
    );

    return res.json(API_SUCCESS_RESPONSE(publishResponse));
  }),
);

router.post(
  '/:botId/unpublish/:runtime',
  asyncHandler(async (req, res) => {
    const bot = await db.get('bot', {
      property: 'id',
      value: req.params.botId,
    });

    API_THROW_ERROR(!bot, 400, 'Bot not found');

    const unpublishResponse = await unpublishRuntime(
      bot,
      req.params.runtime,
      req.body,
    );

    return res.json(API_SUCCESS_RESPONSE(unpublishResponse));
  }),
);

module.exports = router;
