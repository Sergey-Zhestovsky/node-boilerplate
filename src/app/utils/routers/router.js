const { Router: expressRouter } = require('express');

const handlerWrapper = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

const wrap = (action, router) => {
  return (path, ...handlers) => {
    // eslint-disable-next-line no-proto
    router.__proto__[action].bind(router, path, ...handlers.map(handlerWrapper))();
    return router;
  };
};

const Router = (config) => {
  const router = expressRouter(config);
  router.all = wrap('all', router);
  router.get = wrap('get', router);
  router.post = wrap('post', router);
  router.put = wrap('put', router);
  router.delete = wrap('delete', router);
  router.patch = wrap('patch', router);
  router.options = wrap('options', router);
  router.head = wrap('head', router);
  return router;
};

module.exports = Router;
