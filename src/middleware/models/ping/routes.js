const { Router } = require('express');
const { pingController } = require('./controllers');
const { validateQuery } = require('../../utils/routers/validators');

const router = Router();

router.get(
  '/',
  validateQuery(
    (T) => ({
      withTime: T.boolean(),
    }),
    { required: false }
  ),
  (req, res) => {
    const query = req.query;
    const result = pingController(query.withTime);
    return res.status(200).send(result);
  }
);

module.exports = Router().use('/ping', router);
