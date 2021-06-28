const Validator = require('../../libs/Validator');

describe('Validator', () => {
  test('validate trough object', () => {
    const validator = new Validator();
    validator.setSchema((Joi) => ({
      name: Joi.string(),
    }));

    const firstRes = validator.validate({
      name: 'test',
    });
    expect(firstRes).not.toBeNull();
    expect(firstRes.errors).toBeNull();

    const secondRes = validator.validate({
      name: 42,
    });
    expect(secondRes).not.toBeNull();
    expect(typeof secondRes.errorMessage).toBe('string');
  });

  test('validate trough array', () => {
    const validator = new Validator();
    validator.setSchema(['name']);

    const firstRes = validator.validate({
      name: 'test',
    });
    expect(firstRes).not.toBeNull();
    expect(firstRes.errors).toBeNull();

    const secondRes = validator.validate({
      age: 42,
    });
    expect(secondRes).not.toBeNull();
    expect(typeof secondRes.errorMessage).toBe('string');
  });
});
