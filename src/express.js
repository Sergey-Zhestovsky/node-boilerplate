const express = require('express');
const swaggerUi = require('swagger-ui-express');

const { routes, swagger } = require('./app');
const { entry, errorHandler } = require('./middleware');

const app = express();

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swagger));
app.use(entry);
app.use('/api/v1/', routes);
app.use(errorHandler);

module.exports = app;
