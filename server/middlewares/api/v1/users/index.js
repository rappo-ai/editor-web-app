const express = require('express');
const db = require('../../../../db');
const {
  API_SUCCESS_RESPONSE,
  API_THROW_ERROR,
  API_VALIDATE_ADMIN,
  API_VALIDATE_AUTH_SCOPE,
  API_VALIDATE_REQUEST_BODY_PARAMETERS,
  asyncHandler,
} = require('../../../../utils/api');
const {
  USER_ROLE_BOT_END_USER_CREATOR,
  USER_ROLE_END_USER,
} = require('../../../../utils/auth');
const { getUser } = require('../../../../utils/user');
const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    API_VALIDATE_AUTH_SCOPE(req.authInfo, 'GET /api/v1/users');

    const { ownerId, userKey } = req.query;

    if (!ownerId || ownerId !== req.user.id) {
      API_VALIDATE_ADMIN(req.user);
    }
    const queries = [];
    if (ownerId) {
      queries.push({
        property: 'ownerId',
        value: ownerId,
      });
    }
    if (userKey) {
      queries.push({
        property: 'userKey',
        value: userKey,
      });
    }
    const users = await db.query('users', queries);

    res.json(
      API_SUCCESS_RESPONSE({
        data: {
          users,
        },
      }),
    );

    return next();
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res, next) => {
    API_VALIDATE_AUTH_SCOPE(req.authInfo, 'POST /api/v1/users');

    const { ownerId, botId, userKey } = req.body;
    if (req.user.role === USER_ROLE_BOT_END_USER_CREATOR) {
      API_VALIDATE_REQUEST_BODY_PARAMETERS({ ownerId, botId, userKey });
    } else {
      API_VALIDATE_ADMIN(req.user);
    }

    const userData = {
      isActivated: true,
      role: USER_ROLE_END_USER,
    };
    if (ownerId) {
      Object.assign(userData, { ownerId });
    }
    if (botId) {
      Object.assign(userData, { botId });
    }
    if (userKey) {
      Object.assign(userData, { userKey });
    }
    const user = await db.create('users', userData);

    res.json(
      API_SUCCESS_RESPONSE({
        data: {
          user,
        },
      }),
    );

    return next();
  }),
);

router.get(
  '/:userId',
  asyncHandler(async (req, res, next) => {
    API_VALIDATE_AUTH_SCOPE(req.authInfo, 'GET /api/v1/users/:userId');

    const userId = req.params.userId === 'me' ? req.user.id : req.params.userId;
    if (userId !== req.user.id) {
      API_VALIDATE_ADMIN(req.user);
    }

    const user = await getUser(db, userId);
    API_THROW_ERROR(!user, 404, 'User not found');

    res.json(
      API_SUCCESS_RESPONSE({
        user,
      }),
    );

    return next();
  }),
);

router.put(
  '/:userId/profiles/:profileName',
  asyncHandler(async (req, res, next) => {
    API_VALIDATE_AUTH_SCOPE(
      req.authInfo,
      'PUT /api/v1/users/:userId/profiles/:profileName',
    );

    const userId = req.params.userId === 'me' ? req.user.id : req.params.userId;
    if (userId !== req.user.id) {
      API_VALIDATE_ADMIN(req.user);
    }

    const user = await getUser(db, userId);
    API_THROW_ERROR(!user, 404, 'User not found');

    const { data } = req.body;
    API_VALIDATE_REQUEST_BODY_PARAMETERS({ data });

    const { profiles } = user;
    const { profileName } = req.params;
    profiles[profileName] = data;
    await db.update('users', user.id, { profiles });

    res.json(API_SUCCESS_RESPONSE({ user }));

    return next();
  }),
);

// tbd - this needs to be a PATCH request
router.get(
  '/:userId/approve',
  asyncHandler(async (req, res, next) => {
    API_VALIDATE_AUTH_SCOPE(req.authInfo, 'GET /api/v1/users/:userId/approve');

    const user = await getUser(db, req.params.userId);
    API_THROW_ERROR(!user, 404, 'User not found');

    await db.update(user, { isActivated: true });

    res.json(API_SUCCESS_RESPONSE({ user }));

    return next();
  }),
);

module.exports = router;
