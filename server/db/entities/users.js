const { Entity } = require('./_base');

class User extends Entity {
  constructor() {
    super('users');
  }
}

module.exports = {
  Class: User,
  User,
};
