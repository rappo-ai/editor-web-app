const { Entity, Collection } = require('./_base');

class GoogleUser extends Entity {
  constructor() {
    super('googleuser');
  }
}

module.exports = {
  class: GoogleUser,
  GoogleUser,
};
