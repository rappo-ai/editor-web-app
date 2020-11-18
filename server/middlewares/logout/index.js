const express = require('express');
// const db = require('../../db');
const router = express.Router();

router.get('/', (req, res) => {
  // tbd clear db access token
  req.session.destroy(function() {
    res.clearCookie('at');
    res.redirect('/');
  });
});

module.exports = router;
