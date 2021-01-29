const { now } = require('lodash/date');
const { nanoid } = require('nanoid');

class Entity {
  constructor(collection) {
    this.id = nanoid();
    this.createdTs = now();
    this.lastModifiedTs = this.createdTs;
    this.collection = collection;
  }

  set(property, value) {
    this[property] = value;
    this.lastModifiedTs = new Date().getTime();
    return Entity.db.set(this.collection, this);
  }

  delete() {
    return Entity.db.delete(this.collection, this.id);
  }
}

module.exports = {
  Entity,
};
