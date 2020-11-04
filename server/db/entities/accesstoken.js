const { Entity, Collection } = require('./_base');
const { nanoid } = require('nanoid');

class AccessToken extends Entity {
  constructor() {
    super('accesstoken');
    this.value = nanoid();
  }
}

module.exports = {
  class: AccessToken,
  AccessToken,
};
