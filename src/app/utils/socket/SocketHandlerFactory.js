const Joi = require('joi');
const { Server, Socket } = require('socket.io');

const Validator = require('../../../libs/Validator');
const { Client400Error, Client500Error } = require('../../../libs/ClientError');
const SocketHandler = require('./SocketHandler');

class SocketHandlerFactory {
  /**
   * @param {Server} server
   * @param {typeof SocketHandler[]} handlers
   */
  constructor(server, handlers = []) {
    this.server = server;
    this.handlers = handlers;
  }

  /** @param {typeof SocketHandler} handler */
  appendHandler(handler) {
    this.handlers.push(handler);
  }

  /** @param {Socket} socket */
  inject(socket) {
    this.handlers.forEach((Handler) => {
      const handler = new Handler(this.server, socket);

      const handleFn = (...args) => {
        if (!handler.guard(...args)) return;
        const validatedPayloads = SocketHandlerFactory.validatePayloads(handler, args);
        handler.handle(...validatedPayloads);
      };

      socket.on(handler.Event.Name, handleFn);
    });
  }

  /**
   * @param {SocketHandler} handler
   * @param {any[]} payloads
   * @returns {any[]} - validated payloads
   * @throws {Client500Error}
   * @throws {Client400Error}
   */
  static validatePayloads(handler, payloads) {
    const validationSchema = handler.validator(Joi);
    if (validationSchema === null) return payloads;
    const validator = new Validator();
    const result = [];

    if (Array.isArray(validationSchema)) {
      validationSchema.forEach((schema, i) => {
        if (schema) {
          validator.setSchema(schema);
          const vRes = validator.validate(payloads[i]);
          if (vRes === null) throw new Client500Error();
          if (vRes.errors) throw new Client400Error(`Bad payload: ${vRes.errorMessage ?? ''}`);
          result[i] = vRes.value;
        } else {
          result[i] = payloads[i];
        }
      });
    } else {
      validator.setSchema(validationSchema);
      const vRes = validator.validate(payloads[0]);
      if (vRes === null) throw new Client500Error();
      if (vRes.errors) throw new Client400Error(`Bad payload: ${vRes.errorMessage ?? ''}`);
      result[0] = vRes.value;
    }

    return result;
  }
}

module.exports = SocketHandlerFactory;
