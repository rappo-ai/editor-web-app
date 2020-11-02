const { users, googleUsers, accessTokens } = require('../db');

function pojoClone(object) {
  const cloned = {};
  for (const key in object) {
    switch (typeof object[key]) {
      case 'object':
        {
          if (object[key]) {
            cloned[key] = pojoClone(object[key]);
          } else {
            cloned[key] = null;
          }
        }
        break;
      case 'undefined':
        cloned[key] = undefined;
        break;
      case 'function':
        // skip functions
        break;
      default:
        cloned[key] = object[key];
        break;
    }
  }
  return cloned;
}

function serialize(user) {
  return user.id;
}

async function deserialize(id) {
  const user = await users.findById(id);
  if (!user) {
    return null;
  }
  const accessToken = await accessTokens.findById(user.accessTokenId);
  const googleUser = await googleUsers.findByUserId(user.id);
  const deserializedUser = {};
  deserializedUser.id = user.id;
  deserializedUser.accessToken = accessToken.value;
  if (googleUser) {
    deserializedUser.googleProfile = googleUser.profile;
  }
  return deserializedUser;
}

module.exports = {
  pojoClone,
  serialize,
  deserialize,
};
