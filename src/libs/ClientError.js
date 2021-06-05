const serverErrors = require('../data/server-errors.json');

class ClientError extends Error {
  constructor({ code, type, status, title, message }) {
    super(title);

    this.code = code || ClientError.Errors.InternalServerError.code;
    this.type = type || ClientError.Errors.InternalServerError.type;
    this.status = status || ClientError.Errors.InternalServerError.status;
    this.title = title || ClientError.Errors.InternalServerError.title;
    this.message = message;
    this.date = new Date().toISOString();
  }

  static create(error, description) {
    if (error instanceof ClientError) {
      return error;
    } else if (error instanceof Error) {
      return new ClientError({ title: error.name, message: description || error.message });
    } else if (error instanceof String) {
      return new ClientError({ name: error, message: description || error });
    } else if (error instanceof Object) {
      return new ClientError({ ...error, message: description || error.message });
    }

    return new ClientError({ message: description });
  }

  static construct(originErrorObject, override) {
    let origin = { ...originErrorObject };
    if (typeof override === 'object') origin = { ...origin, ...override };
    else if (typeof override === 'string') origin.message = override;
    return origin;
  }

  static get Errors() {
    return serverErrors;
  }

  getError() {
    return {
      code: this.code,
      type: this.type,
      status: this.status,
      title: this.title,
      message: this.message,
      date: this.date,
    };
  }
}

class Client400Error extends ClientError {
  constructor(message) {
    super(ClientError.construct(ClientError.Errors.ValidationError, message));
  }
}

class Client401Error extends ClientError {
  constructor(message) {
    super(ClientError.construct(ClientError.Errors.AuthorizationError, message));
  }
}

class Client403Error extends ClientError {
  constructor(message) {
    super(ClientError.construct(ClientError.Errors.PrivilegeError, message));
  }
}

class Client404Error extends ClientError {
  constructor(message) {
    super(ClientError.construct(ClientError.Errors.NotFound, message));
  }
}

class Client500Error extends ClientError {
  constructor(message) {
    super(ClientError.construct(ClientError.Errors.InternalServerError, message));
  }
}

module.exports = {
  ClientError,
  Client400Error,
  Client401Error,
  Client403Error,
  Client404Error,
  Client500Error,
};
