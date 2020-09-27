const Joi = require('joi');

class Validator {
  constructor() {
    this.schema = null;
    this.config = this.getDefaultConfig();
  }

  getDefaultConfig() {
    return {
      abortEarly: false,
      convert: true,
      presence: 'required',
    };
  }

  setConfig(config) {
    const { required = true, ...rest } = config;
    const validatorConfig = {
      presence: required ? 'required' : 'optional',
      ...rest,
    };
    this.config = Object.assign({}, this.config, validatorConfig);
  }

  setSchema(schema, config = this.getDefaultConfig()) {
    this.setConfig(config);

    if (schema instanceof Function) {
      this.schema = Joi.object(schema(Joi));
      return this;
    }

    if (Array.isArray(schema)) {
      let validationSchema = {};

      schema.forEach((setting) => {
        validationSchema[setting] = Joi.any();
      });
      this.schema = Joi.object(validationSchema);

      return this;
    }

    return this;
  }

  validate(data) {
    let result = null;
    let error = null;

    if (this.schema) {
      result = this.schema.validate(data, this.config);
    }

    if (result && result.error) {
      error = result.error.details
        .map((detail) => detail.message)
        .join(' | ')
        .replace(/"/g, `'`);
    }

    return { value: result.value, error };
  }
}

module.exports = Validator;
