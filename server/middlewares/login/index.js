/* eslint-disable func-names */
const express = require('express');
const { get: getObjectKey, has: hasObjectProperty } = require('lodash/object');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { sendTransactionalEmail } = require('../../utils/email');
const db = require('../../db');
const {
  USER_SERVICE_ADMIN,
  USER_ROLE_SIGNUP_APPROVER,
  USER_ROLE_WEB_APP_USER,
} = require('../../utils/auth');
const { getWebserverUrl } = require('../../utils/host');
const {
  generateAccessToken,
  generateWebAppAccessToken,
  TOKEN_EXPIRY_1_WEEK,
} = require('../../utils/token');
const router = express.Router();

async function authenticateGoogleUser(profile) {
  let user = await db.get('users', {
    property: 'profiles.google.id',
    value: profile.id,
  });

  let accessToken = null;

  if (!user) {
    user = await db.create('users', {
      isActivated: false,
      role: USER_ROLE_WEB_APP_USER,
      profiles: {
        rappo: {
          emailId: getObjectKey(profile, 'emails[0].value', ''),
          displayName: getObjectKey(profile, 'displayName', ''),
          givenName: getObjectKey(profile, 'name.givenName', ''),
          familyName: getObjectKey(profile, 'name.familyName', ''),
          profilePic: getObjectKey(profile, 'photos[0].value', ''),
        },
        google: profile,
      },
    });

    accessToken = await generateWebAppAccessToken(db, user);

    const userApprovalAccessToken = await generateAccessToken(
      db,
      USER_SERVICE_ADMIN,
      USER_ROLE_SIGNUP_APPROVER,
      TOKEN_EXPIRY_1_WEEK,
      true,
    );

    const approvalLink = getWebserverUrl(
      `/api/v1/users/${user.id}/approve?access_token=${
        userApprovalAccessToken.token
      }`,
    );

    await sendTransactionalEmail(
      'no-reply@rappo.ai',
      'server-notifications@rappo.ai',
      `New user sign up - ${getObjectKey(profile, 'displayName', '?')}`,
      '',
      `New user signed up through Google with the following details:\n\nName: ${getObjectKey(
        profile,
        'displayName',
        '',
      )}\nEmail: ${getObjectKey(profile, 'emails[0].value', '?')}\nID: ${
        user.id
      }\n\nClick to approve -> ${approvalLink}`,
    );
  } else {
    // update rappo and google profiles (currently in sync)
    const profiles = Object.assign({}, user.profiles, {
      rappo: {
        emailId: getObjectKey(profile, 'emails[0].value', ''),
        displayName: getObjectKey(profile, 'displayName', ''),
        givenName: getObjectKey(profile, 'name.givenName', ''),
        familyName: getObjectKey(profile, 'name.familyName', ''),
        profilePic: getObjectKey(profile, 'photos[0].value', ''),
      },
      google: profile,
    });
    await db.update(user, { profiles });
    accessToken = await generateWebAppAccessToken(db, user);
  }
  return {
    user,
    accessToken,
  };
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/login/google/redirect',
    },
    async function(googleAccessToken, googleRefreshToken, profile, cb) {
      const { user, accessToken } = await authenticateGoogleUser(profile);
      return cb(null, user, { accessToken, type: 'google' });
    },
  ),
);

router.get(
  '/google',
  passport.authenticate('google', {
    scope: 'openid profile email',
  }),
);

router.get(
  '/google/redirect',
  passport.authenticate('google', { session: false }),
  async function(req, res) {
    if (req.user) {
      req.session.userId = req.user.id;
    }
    if (hasObjectProperty(req, 'authInfo.accessToken.token')) {
      req.session.token = req.authInfo.accessToken.token;
    }
    res.redirect('/');
  },
);

module.exports = router;
