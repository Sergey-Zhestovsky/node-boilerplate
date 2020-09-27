require('dotenv').config();

const ServerError = require('../../../libs/ServerError');
const ENVIRONMENT = require('../../../data/constants/env');

const errorEntry = (error, req, res, next) => {
  console.log(8, error);
  return next(ServerError.create(error));
};

const devError = (error, req, res, next) => {
  if (process.env.NODE_ENV === ENVIRONMENT.PRODUCTION) return next(error);
  return res.status(error.status).send(error.getError());
};

const prodError = (error, req, res, next) => {
  return res.status(error.status).send(error.message);
};

module.exports = [errorEntry, devError, prodError];
