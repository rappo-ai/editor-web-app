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

router.get('/bot', async (req, res) => {
  const { user } = req;
  if (!user || !user.id) {
    res.status(500);
  } else {
    const bots = await db.query('bot', {
      property: 'userid',
      value: user.id,
    });
    res.json({
      bots,
    });
  }
});

router.post('/bot', async (req, res) => {
  const { user } = req;
  if (!user || !user.id) {
    res.status(500);
  } else {
    const name = req.body.name || 'Untitled bot';
    const bot = await db.create('bot');
    await bot.set('userid', user.id);
    await bot.set('name', name);
    res.json({
      bot,
    });
  }
});

module.exports = router;
