class DBEngine {
  constructor() {}

  findById(collection, id) {
    throw new Error('Override not implemented');
  }

  findByProperty(collection, property, value) {
    throw new Error('Override not implemented');
  }

  add(collection, item) {
    throw new Error('Override not implemented');
  }
}

module.exports = {
  DBEngine,
};
