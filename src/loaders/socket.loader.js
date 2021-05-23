const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');

const { entryServer, entrySocket, errorHandler } = require('../middleware/socket');
const logger = require('../libs/Logger');
const socketConfig = require('../config/socket.config');

const DEFAULT_CONFIG = {
  /** relative folder path to file */
  pathPattern: './socket',
  /** file name */
  fileName: '',
};

const socketLoader = (relativePath = __dirname, config = DEFAULT_CONFIG) => {
  const controllers = [];

  const root = fs.readdirSync(path.resolve(relativePath, config.pathPattern));
  root.forEach((rootFolder) => {
    const relPath = path.join(config.pathPattern, rootFolder);
    try {
      controllers.push(require(path.resolve(relativePath, relPath, config.fileName)));
    } catch (e) {
      logger.warn(`Cant find '${config.fileName || 'index.js'}' file in '${relPath}'`);
    }
  });

  return (httpServer) => {
    const io = new Server(httpServer, socketConfig);

    // apply server middleware
    entryServer.forEach((middleware) => middleware(io));

    io.on('connection', (socket) => {
      // apply socket middleware
      entrySocket.forEach((middleware) => middleware(io, socket));
      // apply controllers
      controllers(io, socket);
      // apply error handlers
      errorHandler.forEach((middleware) => middleware(io, socket));
    });
  };
};

module.exports = socketLoader;
