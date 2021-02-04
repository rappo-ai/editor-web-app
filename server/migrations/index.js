const assert = require('assert');
const fs = require('fs');
const path = require('path');

const asyncqueue = require('async/queue');

const MIGRATION_TASK_QUEUED = 'task_queued';
const MIGRATION_TASK_IN_PROGRESS = 'task_in_progress';
const MIGRATION_TASK_COMPLETED = 'task_completed';

const migrationQueue = asyncqueue(processMigration, 1);

function loadTasks(tasksDir) {
  const tasks = {};
  const files = fs.readdirSync(tasksDir);

  files.forEach(file => {
    const filename = path.basename(file, path.extname(file));
    if (filename.startsWith('_')) {
      return;
    }

    // eslint-disable-next-line global-require
    const task = require(path.resolve(__dirname, tasksDir, file));

    assert(tasks[task.name] === undefined);
    assert(task.start !== undefined);

    tasks[task.name] = task;
  });

  return tasks;
}

const migrationTasks = loadTasks(path.resolve(__dirname, './tasks'));

const getMigrationQueue = () => migrationQueue;
const getMigrationTask = taskName => migrationTasks[taskName];

async function processMigration(task, callback) {
  let db;
  let migration;
  try {
    ({ db, migration } = task);

    await db.update(migration, { status: MIGRATION_TASK_IN_PROGRESS });

    const migrationTask = getMigrationTask(migration.taskName);
    if (!migrationTask) {
      throw new Error(`${migration.taskName} not found`);
    }

    await migrationTask.start(db);

    await db.update(migration, { status: MIGRATION_TASK_COMPLETED });
  } catch (err) {
    if (db && migration) {
      await db.update(migration, {
        status: MIGRATION_TASK_COMPLETED,
        error: JSON.stringify(err),
      });
    }
    if (callback) {
      callback(err);
    }
  }
}

module.exports = {
  getMigrationQueue,
  getMigrationTask,
  MIGRATION_TASK_QUEUED,
  MIGRATION_TASK_IN_PROGRESS,
  MIGRATION_TASK_COMPLETED,
};
