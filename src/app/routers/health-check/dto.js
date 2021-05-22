const Joi = require('joi');

const { QueryDto } = require('../../../api/classes/dto');

class HealthCheckDto extends QueryDto {
  constructor({ withEnv }) {
    super();

    this.withEnv = withEnv;
  }

  /** @param {Joi} T */
  static validator(T) {
    return {
      withEnv: T.boolean().optional(),
    };
  }
}

exports.HealthCheckDto = HealthCheckDto;

class PingDto extends QueryDto {
  constructor({ withTime }) {
    super();

    this.withTime = withTime;
  }

  /** @param {Joi} T */
  static validator(T) {
    return {
      withTime: T.boolean().optional(),
    };
  }
}

exports.PingDto = PingDto;
