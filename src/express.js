const express = require('express');

const { routes } = require('./app');
const { entry, errorHandler } = require('./middleware');

const app = express();

app.use(entry);
app.use('/api/v1/', routes);
app.use(errorHandler);

module.exports = app;
