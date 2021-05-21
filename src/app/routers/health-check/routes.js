const Router = require('../../utils/routers/router');
const { pingController, healthController } = require('./controllers');
const { validateQuery } = require('../../../middleware/validators');

const router = Router();

router.get(
  '/',

  validateQuery((T) => ({
    withEnv: T.boolean().optional(),
  })),

  async ({ query }, res) => {
    const result = healthController(query.withEnv);
    return res.status(200).return(result);
  }
);

router.get('/ping', validateQuery(['withTime']), async ({ query }, res) => {
  const result = pingController(query.withTime);
  return res.status(200).return(result);
});

module.exports = Router().use('/health-check', router);
