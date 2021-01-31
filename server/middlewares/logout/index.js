const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  // tbd clear db access token
  req.session.destroy(() => {
    res.clearCookie('at');
    res.redirect('/');

    return next();
  });
});

module.exports = router;
