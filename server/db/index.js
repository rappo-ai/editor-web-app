const { User, users } = require('./entities/user');
const { GoogleUser, googleUsers } = require('./entities/googleuser');
const { AccessToken, accessTokens } = require('./entities/accesstoken');
const { Collection } = require('./entities/_base');
const { factory } = require('./factory');

function setupFactory() {
  factory.register('user', () => new User());
  factory.register('googleuser', () => new GoogleUser());
  factory.register('accesstoken', () => new AccessToken());
}

function init(options) {
  if (!options) {
    options = {};
  }
  if (!options.dbengine) {
    options.dbengine = 'firestore';
  }
  switch (options.dbengine) {
    case 'firestore':
      const { FirestoreDBEngine } = require('./engines/firestore');
      Collection.dbengine = new FirestoreDBEngine();
      break;
    default:
      throw new Error(`Engine ${options.dbengine} not implemented`);
  }

  // tbd loop through all entities and load their objects into the db object automatically
  setupFactory();
}

module.exports = {
  init,
  users,
  googleUsers,
  accessTokens,
};
