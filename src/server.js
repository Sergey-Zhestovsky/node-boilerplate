require('dotenv').config();

const http = require('http');
const app = require('./express');
const Logger = require('./libs/Logger');

const logger = new Logger();

const main = async (process) => {
  const server = http.createServer(app);
  const port = process.env.PORT || 3000;
  const host = process.env.HOST || 'localhost';

  server.listen(port, host, () =>
    logger.info(`Server in '${process.env.NODE_ENV}' mode listening on: http://${host}:${port}`)
  );
};

main(process);
module.exports = main;
