const { Entity } = require('./_base');
const { MIGRATION_TASK_QUEUED } = require('../../migrations');

class Migration extends Entity {
  constructor() {
    super('migrations');
    this.status = MIGRATION_TASK_QUEUED;
    this.error = false;
  }
}

module.exports = {
  Class: Migration,
  Migration,
};
