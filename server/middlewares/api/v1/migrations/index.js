const express = require('express');
const db = require('../../../../db');
const {
  API_SUCCESS_RESPONSE,
  API_THROW_ERROR,
  API_VALIDATE_ADMIN,
  API_VALIDATE_REQUEST_BODY_PARAMETERS,
} = require('../../../../utils/api');
const { getMigrationQueue } = require('../../../../utils/migration');

const router = express.Router();

router.post('/', async (req, res, next) => {
  API_VALIDATE_ADMIN(req.user);

  const { transforms, deletions } = req.body;
  API_VALIDATE_REQUEST_BODY_PARAMETERS({ transforms, deletions });

  const migration = await db.create('migrations', {
    ownerId: req.user.id,
    transforms,
    deletions,
  });

  getMigrationQueue().push(
    { migration },
    err => err && console.log(err.message),
  );

  res.json(
    API_SUCCESS_RESPONSE({
      migration,
      db,
    }),
  );

  return next();
});

router.get('/:migrationId', async (req, res, next) => {
  API_VALIDATE_ADMIN(req.user);

  const migration = await db.get('migrations', req.params.migrationId);

  API_THROW_ERROR(!migration, 404, 'Migration not found');

  res.json(
    API_SUCCESS_RESPONSE({
      migration,
    }),
  );

  return next();
});

module.exports = router;
