const Validator = require('../../../../api/services/validator');
const ServerError = require('../../../../libs/ServerError');

const validate = (requestProperty, errorMessage = (error) => error) => {
  return (schema, validationConfig, replaceBody = false) => {
    const validator = new Validator();
    validator.setSchema(schema, validationConfig);

    return (req, res, next) => {
      const { value, error } = validator.validate(req[requestProperty]);
      if (error) return next(ServerError.create(ServerError.Errors.VALIDATION__ERROR, errorMessage(error)));
      if (replaceBody) req.body = value;
      return next();
    };
  };
};

module.exports = {
  validateBody: validate('body', (error) => `Bad body: ${error}`),
  validateQuery: validate('query', (error) => `Bad query: ${error}`),
};
