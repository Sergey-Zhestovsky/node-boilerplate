const { ClientError, Client404Error, Client500Error } = require('../libs/ClientError');
const { ClientRedirection } = require('../libs/ClientRedirection');
const ServerError = require('../libs/ServerError');
const logger = require('../libs/Logger');
const env = require('../data/env.json');

const client404Error = (req, res, next) => {
  return next(new Client404Error());
};

const clientError = (error, req, res, next) => {
  if (error instanceof ClientError) return res.throw(error);
  if (error instanceof ClientRedirection) return error.redirect(res);
  return next(error);
};

const serverError = (error, req, res, next) => {
  const err = new ServerError(error);
  logger.error(`Unhandled error: '${err.name}': '${err.message}'.\n${err.stack}`);

  if (process.env.NODE_ENV === env.DEVELOPMENT) {
    return res.status(500).return(null, err.getError());
  }

  return res.throw(new Client500Error());
};

module.exports = [client404Error, clientError, serverError];
