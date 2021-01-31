/* eslint-disable func-names */
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { sendTransactionalEmail } = require('../../utils/email');
const db = require('../../db');
const {
  TOKEN_EXPIRY_1_DAY,
  TOKEN_EXPIRY_1_WEEK,
  USER_SERVICE_ADMIN,
  USER_ROLE_SIGNUP_APPROVER,
  USER_ROLE_BOT_DESIGNER,
} = require('../../utils/auth');
const { getWebserverUrl } = require('../../utils/host');
const { pojoClone } = require('../../utils/pojo');
const {
  generateAccessToken,
  expireAccessTokens,
} = require('../../utils/token');
const { getUser } = require('../../utils/user');
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
      role: USER_ROLE_BOT_DESIGNER,
      profiles: {
        rappo: {
          emailId:
            profile.emails && profile.emails.length
              ? profile.emails[0].value
              : '',
          displayName: profile.displayName,
          givenName: profile.name.givenName,
          familyName: profile.name.familyName,
          profilePic:
            profile.photos && profile.photos.length
              ? profile.photos[0].value
              : '',
        },
        google: profile,
      },
    });

    accessToken = await generateAccessToken(
      user,
      USER_ROLE_BOT_DESIGNER,
      TOKEN_EXPIRY_1_DAY(),
    );

    const userApprovalAccessToken = await generateAccessToken(
      USER_SERVICE_ADMIN,
      USER_ROLE_SIGNUP_APPROVER,
      TOKEN_EXPIRY_1_WEEK(),
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
      `New user sign up - ${profile.displayName}`,
      '',
      `New user signed up through Google with the following details:\n\nName: ${
        profile.displayName
      }\nEmail: ${profile.emails[0].value}\nID: ${
        user.id
      }\n\nClick to approve -> ${approvalLink}`,
    );
  } else {
    await expireAccessTokens(user);

    // update rappo and google profiles (currently in sync)
    const profiles = Object.assign({}, user.profiles, {
      rappo: {
        emailId:
          profile.emails && profile.emails.length
            ? profile.emails[0].value
            : '',
        displayName: profile.displayName,
        givenName: profile.name.givenName,
        familyName: profile.name.familyName,
        profilePic:
          profile.photos && profile.photos.length
            ? profile.photos[0].value
            : '',
      },
      google: profile,
    });
    await db.update(user, { profiles });
    accessToken = await generateAccessToken(
      user,
      USER_ROLE_BOT_DESIGNER,
      TOKEN_EXPIRY_1_DAY(),
    );
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
      return cb(null, user, { accessToken });
    },
  ),
);

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(async function(id, cb) {
  cb(null, pojoClone(await getUser(id)));
});

router.get(
  '/google',
  passport.authenticate('google', {
    scope: 'openid profile email',
  }),
);

router.get('/google/redirect', passport.authenticate('google'), async function(
  req,
  res,
) {
  if (req.user) {
    const accessToken = await db.get('tokens', {
      property: 'token',
      value: req.authInfo.accessToken.token,
    });
    if (accessToken) {
      res.cookie('at', accessToken.token);
    }
  }
  res.redirect('/');
});

module.exports = router;
