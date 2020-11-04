const { Entity } = require('./_base');

class GoogleUser extends Entity {
  constructor() {
    super('googleuser');
  }
}

module.exports = {
  Class: GoogleUser,
  GoogleUser,
};
