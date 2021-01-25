const express = require('express');
const { ApiError } = require('../../utils/api');
const router = express.Router();

const v1 = require('./v1');

router.use('/v1', v1);
router.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.httpStatusCode);
    res.json(err.message);
    return res.end();
  }
  return next(err);
});

module.exports = router;
