const { Entity } = require('./_base');

class Model extends Entity {
  constructor() {
    super('model');
  }
}

module.exports = {
  Class: Model,
  Model,
};
