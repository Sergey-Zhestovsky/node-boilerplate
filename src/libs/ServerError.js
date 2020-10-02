class ServerError extends Error {
  constructor(error) {
    super(error.message);
    this.name = error.name;
    this.message = error.message;
    this.stack = error.stack;
  }

  getError() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
    };
  }
}

module.exports = ServerError;
