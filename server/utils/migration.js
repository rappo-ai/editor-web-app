const {
  get: getObjectProperty,
  set: setObjectProperty,
} = require('lodash/object');
const asyncqueue = require('async/queue');

const MIGRATION_TASK_QUEUED = 'task_queued';
const MIGRATION_TASK_IN_PROGRESS = 'task_in_progress';
const MIGRATION_TASK_COMPLETED = 'task_completed';

const migrationQueue = asyncqueue(processMigration, 1);
const getMigrationQueue = () => migrationQueue;

async function processMigration(task, callback) {
  let db;
  let migration;
  try {
    ({ migration, db } = task);

    await db.update(migration, { status: MIGRATION_TASK_IN_PROGRESS });

    if (migration.transforms) {
      let transformPromiseChain = Promise.resolve();
      migration.transforms.forEach(transform => {
        transformPromiseChain = transformPromiseChain.then(() => {
          db.get(transform.sourceCollection).then(sourceObjects => {
            const sourceCollectionPromises = [];
            sourceObjects.forEach(sourceObject => {
              sourceCollectionPromises.push(
                db
                  .get(transform.destinationCollection, {
                    property: transform.destinationJoinKey || 'id',
                    value: getObjectProperty(
                      sourceObject,
                      transform.sourceJoinKey,
                      'id',
                    ),
                  })
                  .then(existingDestObject => {
                    const data = {};
                    if (transform.destinationKey) {
                      setObjectProperty(
                        data,
                        transform.destinationKey,
                        transform.sourceKey
                          ? getObjectProperty(sourceObject, transform.sourceKey)
                          : sourceObject,
                      );
                    } else {
                      Object.assign(
                        data,
                        transform.sourceKey
                          ? getObjectProperty(sourceObject, transform.sourceKey)
                          : sourceObject,
                      );
                    }
                    if (existingDestObject) {
                      return db.update(existingDestObject, {
                        ...data,
                      });
                    }
                    return db.create(transform.destinationCollection, {
                      ...data,
                    });
                  }),
              );
            });
            return Promise.all(sourceCollectionPromises);
          });
        });
      });
      await transformPromiseChain;
    }

    await db.update(migration, { status: MIGRATION_TASK_COMPLETED });
  } catch (err) {
    if (migration && db) {
      try {
        await db.update(migration, {
          status: MIGRATION_TASK_COMPLETED,
          error: err,
        });
      } catch (secondaryError) {
        console.log(secondaryError);
        err.secondaryError = secondaryError;
      }
    }
    callback(err);
  }
}

module.exports = {
  getMigrationQueue,
  MIGRATION_TASK_QUEUED,
  MIGRATION_TASK_IN_PROGRESS,
  MIGRATION_TASK_COMPLETED,
};
