require('dotenv').config();

const http = require('http');
const express = require('express');
const Logger = require('./libs/Logger');
const { entry, api, errorHandler } = require('./middleware');

const logger = new Logger();
const app = express();

app.use(entry);
app.use(api);
app.use(errorHandler);

const server = http.createServer(app);
const port = process.env.PORT || 3000;
server.listen(port, () => logger.info(`Server listening on: http://localhost:${port}`));
