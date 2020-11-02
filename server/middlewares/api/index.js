const express = require('express');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const db = require('../../db');
const { deserialize } = require('../../utils');
const router = express.Router();

passport.use(
  new BearerStrategy(async function(token, done) {
    const mytoken = await db.tokens.findByValue(token);
    const user = mytoken ? await deserialize(mytoken.userId) : null;
    if (!user) {
      return done(null, false);
    }
    return done(null, user, { scope: '*' });
  }),
);

router.use(
  passport.authenticate('bearer', { session: false }),
  (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(401);
    }
  },
);

router.get('/userinfo', (req, res) => {
  res.json(req.user);
});

module.exports = router;
