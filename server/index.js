/* eslint consistent-return:0 import/order:0 */

const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env.server'),
});
const express = require('express');
const passport = require('passport');
const morgan = require('morgan')('combined');
const cookieparser = require('cookie-parser');
const bodyparser = require('body-parser');
const session = require('express-session');
const logger = require('./logger');
const { getSessionStore } = require('./db/stores');
const api = require('./middlewares/api');
const setup = require('./middlewares/frontendMiddleware');
const login = require('./middlewares/login');
const logout = require('./middlewares/logout');
const webhooks = require('./middlewares/webhooks');
const { setWebserverHost, setWebserverProtocol } = require('./utils/host');
const argv = require('./argv');
const port = require('./port');
const isDev = process.env.NODE_ENV !== 'production';
const isProd = process.env.NODE_ENV === 'production';
const ngrok =
  (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel
    ? require('ngrok')
    : false;
const { resolve } = require('path');
const app = express();

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(morgan);
app.use(cookieparser());
app.use(bodyparser.json());

if (isProd) {
  app.set('trust proxy', 1);
}

app.use(
  session({
    cookie: {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
      sameSite: isProd,
      secure: isProd,
    },
    name: 'rsid',
    proxy: isProd,
    resave: false,
    rolling: true,
    saveUninitialized: true,
    secret: process.env.SESSION_COOKIE_SECRET,
    store: getSessionStore(),
  }),
);

// Initialize Passport
app.use(passport.initialize());

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
app.use('/api', api);
app.use('/api/*', (req, res) => res.sendStatus(404));
app.use('/login', login);
app.use('/logout', logout);
app.use('/webhooks', webhooks);

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
      setWebserverHost(url.replace('https://', ''));
      setWebserverProtocol('https');
    } catch (e) {
      return logger.error(e);
    }
    logger.appStarted(port, prettyHost, url);
  } else {
    logger.appStarted(port, prettyHost);
  }
});
