const Joi = require('joi');

class Validator {
  constructor() {
    this.schema = null;
    this.config = this.getDefaultConfig();
  }

  /**
   * @returns {Joi.ValidationOptions}
   */
  getDefaultConfig() {
    return {
      abortEarly: false,
      convert: true,
      presence: 'required',
      allowUnknown: true,
    };
  }

  /**
   * @param {Joi.ValidationOptions} config
   */
  setConfig(config) {
    const { required = true, ...rest } = config;
    const validatorConfig = {
      presence: required ? 'required' : 'optional',
      ...rest,
    };
    this.config = Object.assign({}, this.config, validatorConfig);
  }

  /**
   * @param {(joi: Joi) => Joi.SchemaMap | string[]} schema
   * @param {Joi.ValidationOptions} validationConfig
   */
  setSchema(schema, config = this.getDefaultConfig()) {
    this.setConfig(config);

    let retrievedSchema = null;
    if (schema instanceof Function) {
      retrievedSchema = schema(Joi);
    } else {
      retrievedSchema = schema;
    }

    if (Array.isArray(retrievedSchema)) {
      let validationSchema = {};
      retrievedSchema.forEach((setting) => (validationSchema[setting] = Joi.any()));
      this.schema = Joi.object(validationSchema);
    } else if (typeof retrievedSchema === 'object') {
      this.schema = Joi.object(retrievedSchema);
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
