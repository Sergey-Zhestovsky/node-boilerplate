const Joi = require('joi');

const Validator = require('../../libs/Validator');
const { Client400Error } = require('../../libs/ClientError');

const validate = (requestProperty, errorMessage = (error) => error) => {
  /**
   * @param {(joi: Joi) => Joi.SchemaMap | string[]} schema
   * @param {Joi.ValidationOptions} validationConfig
   * @param {boolean} [replaceObject]
   */
  const validatorMiddleware = (schema, validationConfig, replaceBody = false) => {
    const validator = new Validator();
    validator.setSchema(schema, validationConfig);

    return (req, res, next) => {
      const { value, error } = validator.validate(req[requestProperty]);
      if (error) return next(new Client400Error(errorMessage(error)));
      if (replaceBody) req.body = value;
      return next();
    };
  };

  return validatorMiddleware;
};

module.exports = {
  validateBody: validate('body', (error) => `Bad body: ${error}`),
  validateQuery: validate('query', (error) => `Bad query: ${error}`),
};
