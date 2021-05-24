const { Server, Socket } = require('socket.io');

const SocketEvent = require('./socket-event');

class Room {
  static getName() {
    return new this().getName();
  }

  static get Events() {
    return new this().Events;
  }

  /** @param {Server} server */
  constructor(server) {
    this.server = server;
  }

  getName() {
    return 'room-name';
  }

  /** @returns {Object<string, SocketEvent>} */
  get Events() {
    return {};
  }

  /** @param {Socket} socket */
  join(socket) {
    socket.join(this.getName());
  }

  /** @param {Socket} socket */
  leave(socket) {
    socket.leave(this.getName());
  }

  /** @param {Socket} [socket] */
  toRoom(socket) {
    if (socket) return socket.to(this.getName());
    else return this.server.to(this.getName());
  }
}

module.exports = Room;
