const Router = require('../../utils/routers/router');
const { pingController, healthController } = require('./controllers');
const { validateQuery, validateBody } = require('../../utils/routers/validators');

const router = Router();

router.get(
  '/',
  validateQuery(
    (T) => ({
      withTime: T.boolean(),
    }),
    { required: false }
  ),
  async ({ query }, res) => {
    const result = pingController(query.withTime);
    return res.status(200).return(result);
  }
);

router.post('/health-check', validateBody(['withEnv']), async ({ body }, res) => {
  const result = healthController(body.withEnv);
  return res.status(200).return(result);
});

module.exports = Router().use('/ping', router);
