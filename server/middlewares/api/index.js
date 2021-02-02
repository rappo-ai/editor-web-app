const express = require('express');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;

const db = require('../../db');
const { ApiError, API_THROW_ERROR } = require('../../utils/api');
const {
  decodeToken,
  generateBotDesignerAccessToken,
} = require('../../utils/token');
const { getUser } = require('../../utils/user');

const v1 = require('./v1');

const router = express.Router();

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      const decodedToken = await decodeToken(db, token);
      if (decodedToken.accessToken) {
        return done(null, decodedToken.user, {
          accessToken: decodedToken.accessToken,
          type: 'bearer',
        });
      }
    } catch (err) {
      console.log(err);
    }
    return done(null, false);
  }),
);

// bearer auth
router.use((req, res, next) =>
  passport.authenticate('bearer', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next();
    }
    return req.logIn(user, { session: false }, loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
      req.authInfo = info;
      return next();
    });
  })(req, res, next),
);

// session auth
router.use(async (req, res, next) => {
  if (
    req.session &&
    req.session.userId &&
    req.session.token &&
    !req.user &&
    !req.authInfo
  ) {
    req.user = await getUser(db, req.session.userId);
    const decodedToken = await decodeToken(db, req.session.token);
    let { accessToken } = decodedToken;
    if (accessToken) {
      if (accessToken.isExpired) {
        accessToken = await generateBotDesignerAccessToken(db, req.user);
        req.session.token = accessToken.token;
      }
      req.authInfo = {
        accessToken: decodedToken.accessToken,
        type: 'session',
      };
    }
  }
  next();
});

// post auth
router.use((req, res, next) => {
  API_THROW_ERROR(
    !req.authInfo || !req.authInfo.accessToken,
    401,
    'Unauthorized',
  );
  API_THROW_ERROR(req.authInfo.accessToken.isExpired, 401, 'Token expired');
  if (req.isAuthenticated()) {
    return next();
  }
  return API_THROW_ERROR(
    true,
    401,
    'Authentication failed - Invalid access token',
  );
});

router.use('/v1', v1);

// no error case
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

// error case
router.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.httpStatusCode);
    res.json({
      ok: false,
      error: err.message,
    });
    return res.end();
  }
  return next(err);
});

module.exports = router;
