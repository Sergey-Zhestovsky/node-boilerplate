const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const logger = require('../libs/Logger');

const routesAssembler = () => {
  const root = fs.readdirSync(path.resolve(__dirname, './routers'));
  const result = [];

  root.forEach((rootFolder) => {
    try {
      result.push(require(path.resolve(__dirname, './routers', rootFolder, 'routes.js')));
    } catch (e) {
      logger.warn(`Cant find 'routes.js' file in '${path.join('/routers', rootFolder)}'`);
    }
  });

  return result;
};

const graphqlAssembler = () => {
  const root = fs.readdirSync(path.resolve(__dirname, './graphql'));
  const result = {
    types: [],
    resolvers: {},
  };

  root.forEach((rootFolder) => {
    const basePath = path.resolve(__dirname, './graphql', rootFolder);
    let resolvers = null;
    let types = null;

    try {
      resolvers = require(path.join(basePath, 'resolvers.js'));
    } catch (e) {
      logger.warn(`Cant find 'resolvers.js' file in '${path.join('/graphql', rootFolder)}'`);
    }

    try {
      types = fs.readFileSync(path.join(basePath, 'types.graphql'), 'utf-8');
    } catch (error) {
      logger.warn(`Cant find 'types.graphql' file in '${path.join('/graphql', rootFolder)}'`);
    }

    if (resolvers !== null && types !== null) {
      result.types.push(types);
      result.resolvers = _.merge(result.resolvers, resolvers);
    }
  });

  result.types = result.types.join(' ');
  return result;
};

const socketAssembler = () => null;

module.exports = {
  routes: routesAssembler(),
  graphql: graphqlAssembler(),
  socket: socketAssembler(),
};
