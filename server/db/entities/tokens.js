const { nanoid } = require('nanoid');
const { Entity } = require('./_base');
const { TOKEN_EXPIRY_1_HOUR } = require('../../utils/auth');

class AccessToken extends Entity {
  constructor() {
    super('tokens');
    this.token = nanoid();
    this.expiryTs = TOKEN_EXPIRY_1_HOUR(); // default expiry of 1 hour
    this.isExpired = false;
  }
}

module.exports = {
  Class: AccessToken,
  AccessToken,
};
