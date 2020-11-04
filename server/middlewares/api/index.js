const express = require('express');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const db = require('../../db');
const router = express.Router();

passport.use(
  new BearerStrategy(async function(token, done) {
    const mytoken = await db.get('accesstoken', {
      property: 'value',
      value: token,
    });
    const user = mytoken ? await db.get('user', mytoken.userid) : null;
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

router.get('/userinfo', async (req, res) => {
  const { user } = req;
  if (!user || !user.id) {
    res.status(500);
  } else {
    const googleUser = await db.get('googleuser', {
      property: 'userid',
      value: user.id,
    });
    res.json({
      ...user,
      googleProfile: googleUser,
    });
  }
});

module.exports = router;
