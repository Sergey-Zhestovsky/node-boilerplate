class SocketEvent {
  static get Name() {
    return new this().Name;
  }

  static getName() {
    return new this().Name;
  }

  get Name() {
    return 'socket-event';
  }

  getName() {
    return this.Name;
  }

  toString() {
    this.Name.toString();
  }

  valueOf() {
    this.Name.toString();
  }
}

module.exports = SocketEvent;
