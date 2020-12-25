/* eslint consistent-return:0 import/order:0 */

const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});
const express = require('express');
const passport = require('passport');
const morgan = require('morgan')('combined');
const cookieparser = require('cookie-parser');
const bodyparser = require('body-parser');
const expresssession = require('express-session');
const logger = require('./logger');
const apiV1 = require('./middlewares/api/v1');
const login = require('./middlewares/login');
const logout = require('./middlewares/logout');
const argv = require('./argv');
const port = require('./port');
const setup = require('./middlewares/frontendMiddleware');
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
app.use(
  expresssession({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  }),
);

// Initialize Passport and restore authentication state, if any, from the
// session.
if (isProd) {
  // passport redirects to http on Heroku. The below line is a workaround to do a https redirect.
  // see https://stackoverflow.com/questions/20739744/passportjs-callback-switch-between-http-and-https
  app.enable('trust proxy');
}
app.use(passport.initialize());
app.use(passport.session());

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
app.use('/api/v1', apiV1);
app.use('/api/*', (req, res) => res.sendStatus(404));
app.use('/login', login);
app.use('/logout', logout);

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
