class ConnectorInterface {
  constructor(config) {
    this.config = config;
    this.connection = null;
  }

  async connect() {
    // TODO: implement connection
    this.connection = {};
  }
}

module.exports = ConnectorInterface;
