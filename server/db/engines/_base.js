class DBEngine {
  constructor() {}

  async create(collection, entity) {
    throw new Error('Override not implemented');
  }

  async get(collection, query) {
    throw new Error('Override not implemented');
  }

  async set(collection, entity) {
    throw new Error('Override not implemented');
  }
}

module.exports = {
  DBEngine,
};