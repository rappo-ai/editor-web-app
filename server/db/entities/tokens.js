const { nanoid } = require('nanoid');
const { Entity } = require('./_base');
const { TOKEN_EXPIRY_1_HOUR, getTokenExpiryTs } = require('../../utils/token');

class AccessToken extends Entity {
  constructor() {
    super('tokens');
    this.token = nanoid();
    this.expiryTs = getTokenExpiryTs(TOKEN_EXPIRY_1_HOUR); // default expiry of 1 hour
    this.isRevoked = false;
  }
}

module.exports = {
  Class: AccessToken,
  AccessToken,
};
