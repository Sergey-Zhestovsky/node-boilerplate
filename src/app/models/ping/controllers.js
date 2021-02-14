const HealthService = require('../../../services/HealthService');
const logger = require('../../../libs/Logger');

const debug = logger.getDebug('controller:ping');

const pingController = (withTime) => {
  debug(`Get in pingController with time: '%s'`, withTime);
  if (withTime) return { timeStamp: new Date() };
  return 'pong';
};

const healthController = (withEnv) => {
  debug(`Get in healthController with environment: '%s'`, withEnv);
  const result = HealthService.getServerStatus(withEnv);
  debug(`Get out healthController`);
  return result;
};

module.exports = {
  pingController,
  healthController,
};
