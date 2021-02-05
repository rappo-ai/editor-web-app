const express = require('express');
const db = require('../../../../db');
const {
  ApiError,
  API_THROW_ERROR,
  API_SUCCESS_RESPONSE,
  API_VALIDATE_ADMIN,
  API_VALIDATE_AUTH_SCOPE,
  asyncHandler,
} = require('../../../../utils/api');
const {
  USER_ROLE_BOT_END_USER_CREATOR,
  USER_ROLE_END_USER,
} = require('../../../../utils/auth');
const { publishRuntime, unpublishRuntime } = require('../../../../runtimes');
const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    API_VALIDATE_AUTH_SCOPE(req.authInfo, 'GET /api/v1/bots');

    let { ownerId } = req.query;
    if (!ownerId) {
      ownerId = req.user.id;
    }

    if (ownerId !== req.user.id) {
      API_VALIDATE_ADMIN(req.user);
    }

    const bots = await db.query('bots', {
      property: 'ownerId',
      value: ownerId,
    });

    res.json(API_SUCCESS_RESPONSE({ bots }));
    return next();
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res, next) => {
    API_VALIDATE_AUTH_SCOPE(req.authInfo, 'POST /api/v1/bots');

    let { ownerId } = req.body;
    if (!ownerId) {
      ownerId = req.user.id;
    }

    if (ownerId !== req.user.id) {
      API_VALIDATE_ADMIN(req.user);
    }

    const name = req.body.name || 'Untitled bot';
    const bot = await db.create('bots', {
      ownerId,
      name,
      deployments: {},
    });

    await db.create('users', {
      isActivated: true,
      role: USER_ROLE_BOT_END_USER_CREATOR,
      profiles: {
        rappo: {
          displayName: bot.name,
          profilePic: '',
          emailId: '',
          givenName: '',
          familyName: '',
        },
      },
      botId: bot.id,
    });

    res.status(201);
    res.json(API_SUCCESS_RESPONSE({ bot }));
    return next();
  }),
);

router.get(
  '/:botId',
  asyncHandler(async (req, res, next) => {
    API_VALIDATE_AUTH_SCOPE(req.authInfo, 'GET /api/v1/bots/:botId');

    const bot = await db.get('bots', {
      property: 'id',
      value: req.params.botId,
    });

    API_THROW_ERROR(!bot, 404, 'Bot not found');

    if (bot.ownerId !== req.user.id) {
      if (
        req.user.role === USER_ROLE_END_USER &&
        req.user.botId === req.params.botId
      ) {
        // end user is allowed access to this bot
      } else {
        API_VALIDATE_ADMIN(req.user);
      }
    }

    res.json(API_SUCCESS_RESPONSE({ bot }));
    return next();
  }),
);

router.get(
  '/:botId/models',
  asyncHandler(async (req, res, next) => {
    API_VALIDATE_AUTH_SCOPE(req.authInfo, 'GET /api/v1/bots/:botId/models');

    const bot = await db.get('bots', {
      property: 'id',
      value: req.params.botId,
    });

    API_THROW_ERROR(!bot, 404, 'Bot not found');

    if (bot.ownerId !== req.user.id) {
      if (
        req.user.role === USER_ROLE_END_USER &&
        req.user.botId === req.params.botId
      ) {
        // end user is allowed access to this bot
      } else {
        API_VALIDATE_ADMIN(req.user);
      }
    }

    const models = await db.query('models', {
      property: 'botId',
      value: req.params.botId,
    });

    API_THROW_ERROR(!models, 404, 'Models not found');

    res.json(API_SUCCESS_RESPONSE({ models }));
    return next();
  }),
);

router.post(
  '/:botId/deployments/:runtime',
  asyncHandler(async (req, res, next) => {
    API_VALIDATE_AUTH_SCOPE(
      req.authInfo,
      'POST /api/v1/bots/:botId/deployments/:runtime',
    );

    const bot = await db.get('bots', {
      property: 'id',
      value: req.params.botId,
    });

    API_THROW_ERROR(!bot, 404, 'Bot not found');

    if (bot.ownerId !== req.user.id) {
      API_VALIDATE_ADMIN(req.user);
    }

    await publishRuntime(bot, req.params.runtime, req.body)
      .then(publishResponse => {
        res.status(201);
        res.json(API_SUCCESS_RESPONSE(publishResponse));
      })
      .catch(err => {
        if (err instanceof ApiError) {
          throw err;
        }

        API_THROW_ERROR(true, 500, 'Internal server error');
      });

    return next();
  }),
);

router.delete(
  '/:botId/deployments/:runtime',
  asyncHandler(async (req, res, next) => {
    API_VALIDATE_AUTH_SCOPE(
      req.authInfo,
      'DELETE /api/v1/bots/:botId/deployments/:runtime',
    );

    const bot = await db.get('bots', {
      property: 'id',
      value: req.params.botId,
    });

    API_THROW_ERROR(!bot, 404, 'Bot not found');

    if (bot.ownerId !== req.user.id) {
      API_VALIDATE_ADMIN(req.user);
    }

    await unpublishRuntime(bot, req.params.runtime, req.body)
      .then(unpublishResponse => {
        res.json(API_SUCCESS_RESPONSE(unpublishResponse));
      })
      .catch(err => {
        if (err instanceof ApiError) {
          throw err;
        }

        API_THROW_ERROR(true, 500, 'Internal server error');
      });

    return next();
  }),
);

module.exports = router;
