const { Entity } = require('./_base');

class ChatSession extends Entity {
  constructor() {
    super('chatsession');
    this.botstateid = 'START';
  }
}

module.exports = {
  Class: ChatSession,
  ChatSession,
};
