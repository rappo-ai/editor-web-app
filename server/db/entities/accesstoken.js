const { Entity, Collection } = require('./_base');
const { nanoid } = require('nanoid');

class AccessToken extends Entity {
  constructor(userId) {
    super('accesstoken');
    this.value = nanoid();
    this.userId = userId;
  }
}

class AccessTokenCollection extends Collection {
  constructor() {
    super('accesstokens', AccessToken);
  }

  async findByValue(val) {
    return await super.findByProperty('value', val);
  }
}

const accessTokens = new AccessTokenCollection();

module.exports = {
  AccessToken,
  AccessTokenCollection,
  accessTokens,
};
