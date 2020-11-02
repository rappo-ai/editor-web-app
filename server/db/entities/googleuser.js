const { Entity, Collection } = require('./_base');

class GoogleUser extends Entity {
  constructor(userId, profile) {
    super('googleuser');
    this.id = profile && profile.id;
    this.userId = userId;
    this.profile = profile;
  }
}

class GoogleUserCollection extends Collection {
  constructor() {
    super('googleusers', GoogleUser);
  }

  async findByUserId(id) {
    return await super.findByProperty('userid', id);
  }
}

const googleUsers = new GoogleUserCollection();

module.exports = {
  GoogleUser,
  GoogleUserCollection,
  googleUsers,
};
