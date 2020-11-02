const { Entity, Collection } = require('./_base');

class User extends Entity {
  constructor() {
    super('user');
    this.accessTokenId = null;
  }
}

class UserCollection extends Collection {
  constructor() {
    super('users', User);
  }
}

const users = new UserCollection();

module.exports = {
  User,
  UserCollection,
  users,
};
