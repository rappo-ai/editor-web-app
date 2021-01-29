const express = require('express');
// const db = require('../../db');
const router = express.Router();

router.get('/', (req, res, next) => {
  // tbd clear db access token
  req.session.destroy(function() {
    res.clearCookie('at');
    res.redirect('/');

    return next();
  });
});

module.exports = router;
