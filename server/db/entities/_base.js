const { nanoid } = require('nanoid');

class Entity {
  constructor(type) {
    this.id = nanoid();
    this.type = type;
  }
}

class Collection {
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }

  async findById(id) {
    return await Collection.dbengine.findById(this.name, id);
  }

  async findByProperty(property, value) {
    return await Collection.dbengine.findByProperty(this.name, property, value);
  }

  async add(item) {
    return await Collection.dbengine.add(this.name, item);
  }
}

module.exports = {
  Entity,
  Collection,
};
