const { Entity } = require('./_base');

class Model extends Entity {
  constructor() {
    super('models');
  }
}

module.exports = {
  Class: Model,
  Model,
};
