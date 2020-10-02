require('dotenv').config();

const crypto = require('crypto');
const serverErrors = require('../data/server-errors.json');

class ClientError extends Error {
  constructor({ code, status, name, message }) {
    super(name);

    this.date = new Date().toString();
    this.id = this.createId(code);

    this.code = code || '000';
    this.status = status || '500';
    this.name = name || null;
    this.message = message;
  }

  static create(error, describe) {
    if (error instanceof ClientError) return error;
    if (error instanceof Error)
      return new ClientError({ name: error.name, message: describe || error.message }, error.stack);
    if (error instanceof String) return new ClientError({ name: error, message: describe || error });
    if (error instanceof Object) return new ClientError({ ...error, message: describe || error.message }, error.source);

    return new ClientError({ message: describe }, error);
  }

  static get Errors() {
    return serverErrors;
  }

  createId(code = '000') {
    const hash = crypto.createHash('sha256');
    const hashDate = hash.update(this.date).digest('hex').slice(-8);
    return `${code}-${hashDate}`;
  }

  getError() {
    return {
      id: this.id,
      code: this.code,
      status: this.status,
      name: this.name,
      message: this.message,
      date: this.date,
    };
  }

  reject() {
    return Promise.reject(this);
  }
}

class Client400Error extends ClientError {
  constructor(message) {
    const validError = ClientError.Errors.VALIDATION__ERROR;
    super({
      ...validError,
      message: message || validError.message,
    });
  }
}

class Client500Error extends ClientError {
  constructor() {
    super(ClientError.Errors.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  ClientError,
  Client400Error,
  Client500Error,
};
