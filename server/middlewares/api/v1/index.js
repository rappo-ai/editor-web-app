const express = require('express');

const bots = require('./bots');
const models = require('./models');
const tokens = require('./tokens');
const users = require('./users');

const router = express.Router();

router.use('/bots', bots);
router.use('/models', models);
router.use('/tokens', tokens);
router.use('/users', users);

module.exports = router;
