const { ClientError, Client500Error } = require('../libs/ClientError');
const ServerError = require('../libs/ServerError');
const logger = require('../libs/Logger');
const env = require('../data/env.json');

const client404Error = (req, res, next) => {
  return res.status(404).send('Page not found.');
};

const clientError = (error, req, res, next) => {
  if (error instanceof ClientError) return res.throw(error);
  else return next(error);
};

const serverError = (error, req, res, next) => {
  const err = new ServerError(error);
  logger.error(`Unhandled error: '${err.name}': '${err.message}'.\n${err.stack}`);

  if (process.env.NODE_ENV === env.DEVELOPMENT) {
    return res.status(500).return(null, err.getError());
  } else {
    return res.throw(new Client500Error());
  }
};

module.exports = [client404Error, clientError, serverError];
