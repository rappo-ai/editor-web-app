const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../../db');
const { serialize, deserialize } = require('../../utils');
const { User } = require('../../db/entities/user');
const { GoogleUser } = require('../../db/entities/googleuser');
const { AccessToken } = require('../../db/entities/accesstoken');
const router = express.Router();

async function addGoogleUser(profile) {
  let googleUser = await db.googleUsers.findById(profile.id);
  let user = googleUser ? await db.users.findById(googleUser.userId) : null;
  if (!user) {
    user = new User();
    const mytoken = new AccessToken(user.id);
    await db.tokens.add(mytoken);
    user.accessTokenId = mytoken.id;
    await db.users.add(user);
    googleUser = new GoogleUser(user.id, profile);
    await db.googleUsers.add(googleUser);
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
  cb(null, serialize(user));
});

passport.deserializeUser(async function(id, cb) {
  cb(null, await deserialize(id));
});

router.get(
  '/google',
  passport.authenticate('google', {
    scope: 'openid profile email',
  }),
);

router.get('/google/redirect', passport.authenticate('google'), function(
  req,
  res,
) {
  if (req.user) {
    res.cookie('at', req.user.accessToken);
  }
  res.redirect('/');
});

module.exports = router;
