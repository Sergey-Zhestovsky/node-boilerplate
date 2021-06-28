const { Server } = require('socket.io');

const Room = require('./Room');

class SocketEvent {
  /** @returns {string} */
  static get Name() {
    return new this().Name;
  }

  /** @returns {string} */
  static getName() {
    return new this().Name;
  }

  /** @returns {string} */
  get Name() {
    return 'socket-event';
  }

  /** @returns {string} */
  getName() {
    return this.Name;
  }

  /** @returns {typeof Room | null} */
  static get Room() {
    return new this().Room;
  }

  /**
   * @param {Server} server
   * @returns {Room | null}
   */
  static getRoom(server) {
    return new this().getRoom(server);
  }

  /** @returns {typeof Room | null} */
  get Room() {
    return null;
  }

  /**
   * @param {Server} server
   * @returns {Room | null}
   */
  getRoom(server) {
    const EventRoom = this.Room;
    return EventRoom ? new EventRoom(server) : null;
  }

  /** @returns {string} */
  toString() {
    return this.Name;
  }

  /** @returns {string} */
  valueOf() {
    return this.Name;
  }
}

module.exports = SocketEvent;
