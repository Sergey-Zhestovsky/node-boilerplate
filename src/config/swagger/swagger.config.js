const env = require('../../data/env.json');

module.exports = {
  withSwagger: process.env.SWAGGER === 'on',
  serverURL: process.env.SWAGGER_SERVER_URL,
};
