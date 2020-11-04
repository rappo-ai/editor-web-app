const { nanoid } = require('nanoid');

class Entity {
  constructor(collection) {
    this.id = nanoid();
    this.collection = collection;
  }

  set(property, value) {
    this[property] = value;
    return Entity.db.set(this.collection, this);
  }
}

module.exports = {
  Entity,
};
