const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const logger = require('../libs/Logger');
const queryMutator = require('./utils/queryMutator');
const env = require('../data/env.json');

const setupCors = () => {
  if (process.env.NODE_ENV === env.PRODUCTION) return (req, res, next) => next();
  return cors();
};

const mutateQuery = (req, res, next) => {
  queryMutator(req, res);
  next();
};

module.exports = [
  setupCors(),
  helmet(),
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: '150kb' }),
  cookieParser(),
  compression(),
  morgan(logger.middlewareOutput, { stream: logger.stream() }),
  mutateQuery,
];
