const _ = require('lodash');
const Ping = require('./models/ping');
const entry = require('./utils/routers/entry');
const errorHandler = require('./utils/routers/errorHandlers');

module.exports = {
  entry,
  api: [Ping.router],
  graphql: {
    types: [Ping.type].join(' '),
    resolvers: _.merge({}, Ping.resolver),
  },
  errorHandler,
};
