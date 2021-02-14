const Validator = require('../../libs/Validator');

describe('Validator', () => {
  test('validate trough object', () => {
    const validator = new Validator();
    validator.setSchema((Joi) => ({
      name: Joi.string(),
    }));

    const { error: firstError } = validator.validate({
      name: 'test',
    });
    expect(firstError).toBeNull();

    const { error: secondError } = validator.validate({
      name: 42,
    });
    expect(typeof secondError).toBe('string');
  });

  test('validate trough array', () => {
    const validator = new Validator();
    validator.setSchema(['name']);

    const { error: firstError } = validator.validate({
      name: 'test',
    });
    expect(firstError).toBeNull();

    const { error: secondError } = validator.validate({
      age: 42,
    });
    expect(typeof secondError).toBe('string');
  });
});
