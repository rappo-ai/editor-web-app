const express = require('express');
const db = require('../../../../db');
const {
  API_SUCCESS_RESPONSE,
  API_VALIDATE_REQUEST_BODY_PARAMETERS,
  asyncHandler,
} = require('../../../../utils/api');
const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { user } = req;
    const googleUser = await db.get('googleuser', {
      property: 'userid',
      value: user.id,
    });
    return res.json(
      API_SUCCESS_RESPONSE({
        ...user,
        googleProfile: googleUser,
      }),
    );
  }),
);

router.put(
  '/profile',
  asyncHandler(async (req, res) => {
    const { user } = req;
    const { profile } = req.body;
    API_VALIDATE_REQUEST_BODY_PARAMETERS({ profile });
    const newProfile = { ...user.profile, ...req.body.profile };
    await user.set('profile', newProfile);
    return res.json(
      API_SUCCESS_RESPONSE({
        profile: user.profile,
      }),
    );
  }),
);

module.exports = router;
