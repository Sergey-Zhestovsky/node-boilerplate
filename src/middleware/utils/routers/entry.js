const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');

module.exports = [
  helmet(),
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: '1mb' }),
  cookieParser(),
  compression(),
];
