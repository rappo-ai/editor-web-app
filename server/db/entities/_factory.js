class Factory {
  constructor() {
    this.builders = {};
  }

  register(collection, builder) {
    this.builders[collection] = builder;
  }

  create(collection, data = {}) {
    const entity = this.builders[collection]();
    return Object.assign(entity, data);
  }
}
const factory = new Factory();

module.exports = factory;
