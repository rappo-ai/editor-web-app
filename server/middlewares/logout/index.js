const express = require('express');
const db = require('../../db');
const { expireAccessToken } = require('../../utils/token');

const router = express.Router();

router.get('/', async (req, res) => {
  if (req.session.token) {
    await expireAccessToken(db, req.session.token);
  }
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
