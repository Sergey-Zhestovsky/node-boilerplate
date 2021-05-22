const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const logger = require('../libs/Logger');

const DEFAULT_CONFIG = {
  /** relative folder path to file */
  pathPattern: './graphql',
  /** file name of graphql */
  graphqlFileName: 'types.graphql',
  /** file name of resolvers */
  resolverFileName: 'resolvers.js',
};

const graphqlAssembler = (relativePath = __dirname, config = DEFAULT_CONFIG) => {
  const root = fs.readdirSync(path.resolve(relativePath, config.pathPattern));
  const result = {
    types: [],
    resolvers: {},
  };

  root.forEach((rootFolder) => {
    const relPath = path.join(config.pathPattern, rootFolder);
    const basePath = path.resolve(relativePath, relPath);
    let resolvers = null;
    let types = null;

    try {
      resolvers = require(path.join(basePath, config.resolverFileName));
    } catch (e) {
      logger.warn(`Cant find '${config.resolverFileName}' file in '${relPath}'`);
    }

    try {
      types = fs.readFileSync(path.join(basePath, config.graphqlFileName), 'utf-8');
    } catch (error) {
      logger.warn(`Cant find '${config.graphqlFileName}' file in '${relPath}'`);
    }

    if (resolvers !== null && types !== null) {
      result.types.push(types);
      result.resolvers = _.merge(result.resolvers, resolvers);
    }
  });

  result.types = result.types.join(' ');
  return result;
};

module.exports = graphqlAssembler;
