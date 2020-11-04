const { Entity } = require('./_base');

class User extends Entity {
  constructor() {
    super('user');
  }
}

module.exports = {
  class: User,
  User,
};
