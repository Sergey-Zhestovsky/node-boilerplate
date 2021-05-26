const Joi = require('joi');
const { Server, Socket } = require('socket.io');

const Room = require('./Room');

class SocketHandler {
  /**
   * @param {Server} server
   * @param {Socket} socket
   */
  constructor(server, socket) {
    this.server = server;
    this.socket = socket;
  }

  /**
   * @returns {string}
   */
  get Event() {
    return 'socket-event';
  }

  /**
   * @returns {typeof Room | Room | null}
   */
  get Room() {
    return null;
  }

  /**
   * if this.Room !== null
   */
  validateRoomAccess() {
    if (!this.socket.rooms.has(this.Room)) {
      throw Error('403');
    }
  }

  /**
   * @param {any[]} args
   */
  handle(...args) {}

  /**
   * Return s validation schema for dto
   * @param {Joi} T
   * @returns {null | Joi.Schema | (Joi.Schema | null)[]} - `null`: without validation,
   *   `Joi.Schema`: for validation first arg, array of `Joi.Schema | null`: for
   *   validation all arguments taken by `handle` function.
   */
  validator(T) {
    return null;
  }
}

module.exports = SocketHandler;
