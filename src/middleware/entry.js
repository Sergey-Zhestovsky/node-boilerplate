const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const logger = require('../libs/Logger');
const queryMutator = require('./utils/query-mutator');
const corsConfig = require('../config/cors.config');
const helmetConfig = require('../config/helmet.config');

const setupCors = () => {
  if (!corsConfig.withCors) return (req, res, next) => next();
  return cors(corsConfig.config);
};

const mutateQuery = (req, res, next) => {
  queryMutator(req, res);
  next();
};

module.exports = [
  setupCors(),
  helmet(helmetConfig),
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: '150kb' }),
  cookieParser(),
  compression(),
  morgan(logger.middlewareOutput, { stream: logger.stream() }),
  mutateQuery,
];
