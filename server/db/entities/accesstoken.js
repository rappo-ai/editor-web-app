const { nanoid } = require('nanoid');
const { Entity } = require('./_base');

class AccessToken extends Entity {
  constructor() {
    super('accesstoken');
    this.value = nanoid();
  }
}

module.exports = {
  Class: AccessToken,
  AccessToken,
};
