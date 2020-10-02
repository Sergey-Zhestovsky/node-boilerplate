const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const Logger = require('../libs/Logger');
const queryMutator = require('./utils/queryMutator');

const logger = new Logger();

const mutateQuery = (req, res, next) => {
  queryMutator(req, res);
  next();
};

module.exports = [
  helmet(),
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: '150kb' }),
  cookieParser(),
  compression(),
  morgan(Logger.middlewareOutput, { stream: logger.stream() }),
  mutateQuery,
];
