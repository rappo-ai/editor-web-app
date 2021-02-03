const { Entity } = require('./_base');

class ChatSession extends Entity {
  constructor() {
    super('chatsessions');
    this.botStateId = 'START';
  }
}

module.exports = {
  Class: ChatSession,
  ChatSession,
};
