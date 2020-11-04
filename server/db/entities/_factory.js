class Factory {
  constructor() {
    this.builders = {};
  }

  register(collection, builder) {
    this.builders[collection] = builder;
  }

  create(collection) {
    return this.builders[collection]();
  }
}
const factory = new Factory();

module.exports = factory;
