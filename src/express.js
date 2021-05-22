const express = require('express');
const swaggerUi = require('swagger-ui-express');

const { routes, swagger } = require('./app');
const { entry, errorHandler } = require('./middleware');
const swaggerConfig = require('./config/swagger/swagger.config');

const app = express();

if (swaggerConfig.whiteListEnv.includes(process.env.NODE_ENV)) {
  app.use('/swagger', swaggerUi.serve);
  swagger.then((swaggerAPI) => {
    app.get('/swagger', swaggerUi.setup(swaggerAPI));
  });
}

app.use(entry);
app.use('/api/v1/', routes);
app.use(errorHandler);

module.exports = app;
