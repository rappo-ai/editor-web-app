const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../../db');
const { pojoClone } = require('../../utils');
const router = express.Router();

async function addGoogleUser(profile) {
  let googleUser = await db.get('googleuser', {
    property: 'profile.id',
    value: profile.id,
  });
  let user = googleUser ? await db.get('user', googleUser.userid) : null;
  if (!user) {
    user = await db.create('user');
  }
  if (!googleUser) {
    googleUser = await db.create('googleuser');
    googleUser.set('userid', user.id);
    googleUser.set('profile', profile);
  }
  let accessToken = await db.get('accesstoken', {
    property: 'userid',
    value: user.id,
  });
  if (!accessToken) {
    accessToken = await db.create('accesstoken');
    accessToken.set('userid', user.id);
    user.set('accesstokenid', accessToken.id);
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