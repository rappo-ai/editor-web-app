const { Entity } = require('./_base');

class Bot extends Entity {
  constructor() {
    super('bot');
  }
}

module.exports = {
  Class: Bot,
  Bot,
};
