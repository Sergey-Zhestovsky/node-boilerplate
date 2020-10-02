const _ = require('lodash');
const Ping = require('./models/ping');

module.exports = {
  api: [Ping.router],
  graphql: {
    types: [Ping.type].join(' '),
    resolvers: _.merge({}, Ping.resolver),
  },
};
