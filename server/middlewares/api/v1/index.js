const express = require('express');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;

const db = require('../../../db');
const { API_THROW_ERROR } = require('../../../utils/api');
const { decodeToken } = require('../../../utils/token');
const bots = require('./bots');
const models = require('./models');
const users = require('./users');

const router = express.Router();

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      const decodedToken = await decodeToken(token);
      if (decodedToken.accessToken) {
        return done(null, decodedToken.user, {
          accessToken: decodedToken.accessToken,
        });
      }
    } catch (err) {
      console.log(err);
    }
    return done(null, false);
  }),
);

router.use(
  passport.authenticate('bearer', { session: false }),
  (req, res, next) => {
    API_THROW_ERROR(
      req.authInfo.accessToken.isExpired,
      401,
      'Authentication failed - Token expired',
    );
    if (req.isAuthenticated()) {
      return next();
    }
    return API_THROW_ERROR(
      true,
      401,
      'Authentication failed - Invalid access token',
    );
  },
);

router.use('/bots', bots);
router.use('/models', models);
router.use('/users', users);

router.use(async req => {
  // do not let any errors propagate or call the next() middleware
  // as the response is already sent at this point
  try {
    if (req.authInfo.accessToken && req.authInfo.accessToken.isOneTimeUse) {
      await db.update(req.authInfo.accessToken, {
        isExpired: true,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
