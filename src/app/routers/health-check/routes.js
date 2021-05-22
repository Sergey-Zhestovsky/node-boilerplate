const Router = require('../../utils/routers/router');
const { pingController, healthController } = require('./controllers');
const {
  validators: { validateQuery },
} = require('../../../middleware');
const { HealthCheckDto, PingDto } = require('./dto');

const router = Router();

router.get('/', validateQuery(HealthCheckDto), async ({ query }, res) => {
  const result = healthController(query);
  return res.status(200).return(result);
});

router.get('/ping', validateQuery(PingDto), async ({ query }, res) => {
  const result = pingController(query);
  return res.status(200).return(result);
});

module.exports = Router().use('/health-check', router);
