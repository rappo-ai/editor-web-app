const express = require('express');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;

const db = require('../../../db');
const { API_THROW_ERROR } = require('../../../utils/api');
const bot = require('./bot');
const model = require('./model');
const user = require('./user');

const router = express.Router();

passport.use(
  new BearerStrategy(async (token, done) => {
    const mytoken = await db.get('accesstoken', {
      property: 'value',
      value: token,
    });
    const dbuser = mytoken ? await db.get('user', mytoken.userid) : null;
    if (!dbuser) {
      return done(null, false);
    }
    return done(null, dbuser, { scope: '*' });
  }),
);

router.use(
  passport.authenticate('bearer', { session: false }),
  (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    return API_THROW_ERROR(true, 401, 'Authentication failed');
  },
);

router.use('/bot', bot);
router.use('/model', model);
router.use('/user', user);

module.exports = router;
