const express = require('express');
const { getUserQueue } = require('../../../runtimes/telegram');
const router = express.Router();

router.post('/:botId/:botSecret', (req, res) => {
  if (req.body.message && req.body.message.from) {
    const userQueue = getUserQueue(req.body.message.from);
    userQueue.push(
      {
        botId: req.params.botId,
        botSecret: req.params.botSecret,
        update: req.body,
      },
      err => err && console.log(err.message),
    );
  }
  res.status(200);
  return res.end();
});

module.exports = router;
