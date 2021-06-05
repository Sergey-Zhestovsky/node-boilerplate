const Joi = require('joi');

const { Dto } = require('../../api/classes/dto');
const Validator = require('../../libs/Validator');
const { Client400Error } = require('../../libs/ClientError');
const classOf = require('../../utils/classOf');

const validate = (requestProperty, errorMessage = (error) => error) => {
  /**
   * @param {((joi: Joi) => Joi.SchemaMap | string[]) | Dto} schema
   * @param {Joi.ValidationOptions} [validationConfig]
   * @param {boolean} [replaceContent]
   */
  const validatorMiddleware = (schema, validationConfig, replaceContent) => {
    const validator = new Validator();
    const isDto = classOf(schema, Dto, {});
    validator.setSchema(isDto ? schema.validator : schema, validationConfig);

    return (req, res, next) => {
      const { value, error } = validator.validate(req[requestProperty]);
      if (error) return next(new Client400Error(errorMessage(error)));

      if (isDto && replaceContent === undefined) {
        const DtoSchema = schema;
        req[requestProperty] = new DtoSchema(value);
      } else if (replaceContent) {
        req[requestProperty] = value;
      }

      return next();
    };
  };

  return validatorMiddleware;
};

module.exports = {
  validateBody: validate('body', (error) => `Bad body: ${error}`),
  validateQuery: validate('query', (error) => `Bad query: ${error}`),
};
