const express = require('express');
const { api } = require('./app');
const { entry, errorHandler } = require('./middleware');

const app = express();

app.use(entry);
app.use(api);
app.use(errorHandler);

module.exports = app;
