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
    return this.Name;
  }

  valueOf() {
    return this.Name;
  }
}

module.exports = SocketEvent;
