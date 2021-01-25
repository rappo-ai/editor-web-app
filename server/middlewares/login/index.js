const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { sendTransactionalEmail } = require('../../email');
const db = require('../../db');
const { pojoClone } = require('../../utils/pojo');
const router = express.Router();

async function addGoogleUser(profile) {
  let googleUser = await db.get('googleuser', {
    property: 'profile.id',
    value: profile.id,
  });
  let user = googleUser ? await db.get('user', googleUser.userid) : null;
  if (!user) {
    user = await db.create('user');
    user.set('isActivated', false);

    sendTransactionalEmail(
      'no-reply@rappo.ai',
      'server-notifications@rappo.ai',
      `New user sign up - ${profile.displayName}`,
      '',
      `New user signed up through Google with the following details:\n\nName: ${
        profile.displayName
      }\nEmail: ${profile.emails[0].value}\nID: ${user.id}`,
    );
  }
  if (!googleUser) {
    googleUser = await db.create('googleuser');
    await googleUser.set('userid', user.id);
  }
  await googleUser.set('profile', profile);
  let accessToken = await db.get('accesstoken', {
    property: 'userid',
    value: user.id,
  });
  if (!accessToken) {
    accessToken = await db.create('accesstoken');
    await accessToken.set('userid', user.id);
    await user.set('accesstokenid', accessToken.id);
  }

  return user;
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/login/google/redirect',
    },
    async function(accessToken, refreshToken, profile, cb) {
      return cb(null, await addGoogleUser(profile));
    },
  ),
);

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(async function(id, cb) {
  cb(null, pojoClone(await db.get('user', id)));
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
  if (req.user && req.user.accesstokenid) {
    const accessToken = await db.get('accesstoken', req.user.accesstokenid);
    if (accessToken) {
      res.cookie('at', accessToken.value);
    }
  }
  res.redirect('/');
});

module.exports = router;
