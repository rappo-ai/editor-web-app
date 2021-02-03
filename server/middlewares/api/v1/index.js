const express = require('express');

const bots = require('./bots');
const migrations = require('./migrations');
const models = require('./models');
const tokens = require('./tokens');
const users = require('./users');

const router = express.Router();

router.use('/bots', bots);
router.use('/migrations', migrations);
router.use('/models', models);
router.use('/tokens', tokens);
router.use('/users', users);

module.exports = router;
