class Factory {
  constructor() {
    this.creators = {};
  }

  register(type, creator) {
    this.creators[type] = creator;
  }

  get(type) {
    return this.creators[type]();
  }
}
const factory = new Factory();

module.exports = {
  factory,
};
