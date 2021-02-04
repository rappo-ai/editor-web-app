const express = require('express');
const db = require('../../db');
const { revokeAccessToken } = require('../../utils/token');

const router = express.Router();

router.get('/', async (req, res) => {
  if (req.session.token) {
    await revokeAccessToken(db, req.session.token).catch(err =>
      console.log(err),
    );
  }
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
