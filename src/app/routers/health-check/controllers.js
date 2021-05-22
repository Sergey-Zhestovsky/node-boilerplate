const HealthService = require('../../../services/HealthService');
const logger = require('../../../libs/Logger');
const env = require('../../../data/env.json');

const debug = logger.getDebug('controller:health-check');

const pingController = (withTime) => {
  debug(`Get in pingController with time: '%s'`, withTime);
  if (withTime) return { timeStamp: new Date() };
  return 'pong';
};

const healthController = (withEnv) => {
  debug(`Get in healthController with environment: '%s'`, withEnv);
  if (process.env.NODE_ENV === env.PRODUCTION) withEnv = false;
  const result = HealthService.getServerStatus(withEnv);
  debug(`Get out healthController`);
  return result;
};

module.exports = {
  pingController,
  healthController,
};
