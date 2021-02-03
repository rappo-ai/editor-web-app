const express = require('express');
const db = require('../../../../db');
const {
  API_SUCCESS_RESPONSE,
  API_THROW_ERROR,
  API_VALIDATE_ADMIN,
  API_VALIDATE_AUTH_SCOPE,
  API_VALIDATE_REQUEST_BODY_PARAMETERS,
  API_VALIDATE_SUPER_ADMIN,
  asyncHandler,
} = require('../../../../utils/api');
const {
  USER_ROLE_BOT_END_USER_CREATOR,
  USER_ROLE_END_USER,
  USER_ROLE_SUPER_ADMIN,
} = require('../../../../utils/auth');
const {
  generateAccessToken,
  TOKEN_EXPIRY_1_HOUR,
  TOKEN_EXPIRY_1_DAY,
} = require('../../../../utils/token');
const { getUser } = require('../../../../utils/user');

const router = express.Router();

router.post(
  '/',
  asyncHandler(async (req, res, next) => {
    API_VALIDATE_AUTH_SCOPE(req.authInfo, 'POST /api/v1/tokens');

    const { userId, role, tokenExpiry } = req.body;
    API_VALIDATE_REQUEST_BODY_PARAMETERS({ userId, role, tokenExpiry });

    API_THROW_ERROR(
      ![TOKEN_EXPIRY_1_HOUR, TOKEN_EXPIRY_1_DAY].includes(tokenExpiry),
      400,
      `Please use a valid value for 'tokenExpiry'. Valid values are ['${TOKEN_EXPIRY_1_HOUR}', '${TOKEN_EXPIRY_1_DAY}']`,
    );

    const user = await getUser(db, userId);
    if (req.user.id !== userId) {
      if (req.user.role === USER_ROLE_BOT_END_USER_CREATOR) {
        API_THROW_ERROR(
          user.ownerId !== req.user.id,
          403,
          'Bot user cannot create an access token for this user',
        );
        API_THROW_ERROR(
          role !== USER_ROLE_END_USER,
          403,
          `Bot user can only create access tokens with role '${USER_ROLE_END_USER}'`,
        );
        API_THROW_ERROR(
          tokenExpiry !== TOKEN_EXPIRY_1_HOUR,
          403,
          `Bot user can only create access tokens with tokenExpiry '${TOKEN_EXPIRY_1_HOUR}'`,
        );
      } else if (role === USER_ROLE_SUPER_ADMIN) {
        API_VALIDATE_SUPER_ADMIN(req.user);
        API_THROW_ERROR(
          tokenExpiry !== TOKEN_EXPIRY_1_HOUR,
          403,
          'Super Admin tokens cannot be issued for more than 1 hour',
        );
      } else {
        API_VALIDATE_ADMIN(req.user);
      }
    }
    const accessToken = await generateAccessToken(db, user, role, tokenExpiry);

    res.json(
      API_SUCCESS_RESPONSE({
        data: {
          accessToken,
        },
      }),
    );

    return next();
  }),
);

module.exports = router;
