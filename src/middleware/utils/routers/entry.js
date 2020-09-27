const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const Logger = require('../../../libs/Logger');

const logger = new Logger();

module.exports = [
  helmet(),
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: '1mb' }),
  cookieParser(),
  compression(),
  morgan(Logger.middlewareOutput, { stream: logger.stream() }),
];
