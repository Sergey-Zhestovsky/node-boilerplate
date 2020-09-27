module.exports = {
  router: require('./routes'),
  type: require('../../utils/graphql/loader')(__dirname, 'types.graphql'),
  resolver: require('./resolvers'),
};
