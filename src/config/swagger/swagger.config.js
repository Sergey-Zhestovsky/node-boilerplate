const env = require('../../data/env.json');

module.exports = {
  whiteListEnv: [env.DEVELOPMENT],
  serverURL: process.env.SWAGGER_SERVER_URL,
};
