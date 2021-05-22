const fs = require('fs');
const path = require('path');
const glob = require('glob');
const deasync = require('deasync');
const yaml = require('js-yaml');
const _ = require('lodash');
const SwaggerParser = require('swagger-parser');

const logger = require('../libs/Logger');
const swaggerConfig = require('../config/swagger/swagger.config');

const DEFAULT_CONFIG = {
  filePath: './routers/*/',
  fileName: 'swagger.@(yaml|yml|json)',
};

const extractObjectFromFile = (pathToFile) => {
  const ext = path.extname(pathToFile);

  if (/y(a)?ml/.test(ext)) {
    try {
      const doc = yaml.load(fs.readFileSync(pathToFile, 'utf8'));
      return doc;
    } catch (e) {
      return {};
    }
  } else if (ext === 'json') {
    return require(pathToFile);
  }

  return {};
};

const swaggerLoader = (relativePath = __dirname, config = DEFAULT_CONFIG) => {
  // load base file
  const baseSwaggerPath = path.resolve(__dirname, '../config/swagger', config.fileName);
  const existedSwaggerBasePaths = glob.sync(baseSwaggerPath);

  if (existedSwaggerBasePaths.length === 0) {
    logger.error(`Base swagger file not found by path '${baseSwaggerPath}'`);
    return null;
  }

  const baseSwaggerFile = extractObjectFromFile(existedSwaggerBasePaths[0]);
  // add server path
  baseSwaggerFile.servers = [...(baseSwaggerFile.servers || []), { url: swaggerConfig.serverURL }];

  // load all files from app
  const pathToAllSwaggerFiles = path.resolve(relativePath, config.filePath, config.fileName);
  const foundSwaggerFilePaths = glob.sync(pathToAllSwaggerFiles);
  const foundSwaggerFiles = foundSwaggerFilePaths.map((sp) => {
    const obj = extractObjectFromFile(sp);
    // only fields `tags`, `components`, `paths`
    return { tags: obj.tags || [], components: obj.components || {}, paths: obj.paths || {} };
  });

  // parse and concat file
  const concatSwaggerAPI = _.mergeWith({}, ...foundSwaggerFiles, (objValue, srcValue) => {
    if (objValue === null) return srcValue;
    if (srcValue === null) return objValue;
  });

  // merge resulted swagger file
  const resultedSwagger = _.merge({}, baseSwaggerFile, concatSwaggerAPI);
  if (!resultedSwagger.tags) resultedSwagger.tags = [];
  if (!resultedSwagger.paths) resultedSwagger.paths = {};
  if (!resultedSwagger.components) resultedSwagger.components = {};
  if (!resultedSwagger.components.securitySchemes) resultedSwagger.components.securitySchemes = {};
  if (!resultedSwagger.components.schemas) resultedSwagger.components.schemas = {};

  // validate file
  try {
    const validate = deasync(SwaggerParser.validate.bind(SwaggerParser));
    return validate(resultedSwagger);
  } catch (err) {
    logger.error(err.message);
    return null;
  }
};

module.exports = swaggerLoader;
