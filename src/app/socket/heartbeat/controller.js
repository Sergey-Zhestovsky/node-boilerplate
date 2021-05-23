const HealthService = require('../../../services/HealthService');

exports.heartbeatController = async (payload) => {
  return HealthService.getServerStatus(false);
};
