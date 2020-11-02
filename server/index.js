/* eslint consistent-return:0 import/order:0 */

require('dotenv').config();
const express = require('express');
const passport = require('passport');
const morgan = require('morgan')('combined');
const cookie_parser = require('cookie-parser');
const body_parser = require('body-parser');
const express_session = require('express-session');
const logger = require('./logger');
const api = require('./middlewares/api');
const login = require('./middlewares/login');
const argv = require('./argv');
const port = require('./port');
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok =
  (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel
    ? require('ngrok')
    : false;
const { resolve } = require('path');
const app = express();
const db = require('./db');
db.init();

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(morgan);
app.use(cookie_parser());
app.use(body_parser.urlencoded({ extended: true }));
app.use(
  express_session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  }),
);

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
app.use('/api', api);
app.use('/login', login);

app.use('*', (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login/google');
  }
});

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

// use the gzipped bundle
/* app.get('*.js', (req, res, next) => {
  req.url = req.url + '.gz'; // eslint-disable-line
  res.set('Content-Encoding', 'gzip');
  next();
}); */

// Start your app.
app.listen(port, host, async err => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    let url;
    try {
      url = await ngrok.connect(port);
    } catch (e) {
      return logger.error(e);
    }
    logger.appStarted(port, prettyHost, url);
  } else {
    logger.appStarted(port, prettyHost);
  }
});
