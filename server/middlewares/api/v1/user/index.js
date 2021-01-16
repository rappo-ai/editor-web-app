const express = require('express');
const db = require('../../../../db');
const router = express.Router();

router.get('/', async (req, res) => {
  const { user } = req;
  if (!user || !user.id) {
    res.status(500);
    return res.end();
  }
  const googleUser = await db.get('googleuser', {
    property: 'userid',
    value: user.id,
  });
  return res.json({
    ...user,
    googleProfile: googleUser,
  });
});

router.put('/profile', async (req, res) => {
  const { user } = req;
  if (!user || !user.id) {
    res.status(500);
    return res.end();
  }
  const profile = { ...user.profile, ...req.body.profile };
  await user.set('profile', profile);
  return res.json({
    profile: user.profile,
  });
});

module.exports = router;
