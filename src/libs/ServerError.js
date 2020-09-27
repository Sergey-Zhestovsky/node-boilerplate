require('dotenv').config();

const crypto = require('crypto');
const serverErrors = require('../data/server-errors.json');
const ENVIRONMENT = require('../data/constants/env');

class ServerError extends Error {
  constructor({ code, status, name, message }, source) {
    super(name);

    this.date = new Date().toString();
    this.id = this.createId(code, source);

    this.code = code || '000';
    this.status = status || '500';
    this.name = name || null;
    this.message = message;
    this.source = source;
  }

  static create(error, describe) {
    if (error instanceof ServerError) return error;
    if (error instanceof Error)
      return new ServerError({ name: error.name, message: describe || error.message }, error.stack);
    if (error instanceof String) return new ServerError({ name: error, message: describe || error });
    if (error instanceof Object) return new ServerError({ ...error, message: describe || error.message }, error.source);

    return new ServerError({ message: describe }, error);
  }

  static get Errors() {
    return serverErrors;
  }

  setSource(source) {
    this.source = source;
  }

  createId(code = '000', source) {
    const hash = crypto.createHash('sha256');
    const hashDate = hash.update(this.date).digest('hex').slice(-8);
    let hashSource = '';

    if (source) {
      const hash = crypto.createHash('sha256');
      const sourceString = typeof source === typeof {} ? JSON.stringify(source) : source.toString();
      hashSource = '-' + hash.update(sourceString).digest('hex').slice(-12);
    }

    return `${code}-${hashDate}${hashSource}`;
  }

  getOriginError() {
    return new Error(`${this.code}: ${this.name}`);
  }

  getError() {
    return {
      id: this.id,
      code: this.code,
      status: this.status,
      name: this.name,
      message: this.message,
      date: this.date,
      source: process.env.NODE_ENV === ENVIRONMENT.DEVELOPMENT ? this.source : undefined,
    };
  }

  reject() {
    return Promise.reject(this);
  }
}

module.exports = ServerError;
