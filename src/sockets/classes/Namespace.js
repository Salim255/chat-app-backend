class Namespace {
  constructor (activeConversation) {
    this.id = activeConversation.id;
    this.messages = activeConversation.messages;
    this.users = activeConversation.users;
    this.endpoint = `/${this.id}`;
  }
}

module.exports = Namespace;
