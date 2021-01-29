const { Entity } = require('./_base');

class Bot extends Entity {
  constructor() {
    super('bots');
  }
}

module.exports = {
  Class: Bot,
  Bot,
};
