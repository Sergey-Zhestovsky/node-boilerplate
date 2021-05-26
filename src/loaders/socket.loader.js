const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');

const logger = require('../libs/Logger');
const socketConfig = require('../config/socket.config');
const SocketHandlerFactory = require('../app/utils/socket/SocketHandlerFactory');

const DEFAULT_CONFIG = {
  /** relative folder path to file */
  pathPattern: './socket',
  filesStructure: {
    middleware: {
      path: '/middleware',
      entryServerFile: 'entryServer.js',
      entrySocketFile: 'entrySocket.js',
      errorHandlerFile: 'errorHandler.js',
    },
    handlers: '/handlers',
    controllers: '/controllers',
    namespaces: '/namespaces',
  },
};

const retrieveModule = (pathToFile, errorMessage = 'Cant resolve path') => {
  try {
    return require(pathToFile);
  } catch (error) {
    logger.warn(`${errorMessage} '${pathToFile}'`);
  }
};

const retrieveFilesFromDir = (dirPath) => {
  const root = fs.readdirSync(dirPath);
  const res = [];

  root.forEach((file) => {
    try {
      res.push({ module: require(path.join(dirPath, file)), path: dirPath, file: file });
    } catch (e) {
      logger.warn(`Cant retrieve '${file}' file from '${dirPath}'`);
    }
  });

  return res;
};

const applyControllers = (controllerFiles, server, context) => {
  const processObject = (controller) => {
    if (typeof controller === 'function') {
      controller(server, context);
    } else if (typeof controller === 'object') {
      for (let name in controller) processObject(controller[name]);
    }
  };

  controllerFiles.forEach(({ module }) => processObject(module));
};

const socketLoader = (relativePath = __dirname, config = DEFAULT_CONFIG) => {
  const rootPath = path.resolve(relativePath, config.pathPattern);

  // get (import) all files
  const middlewareFiles = {
    entryServerFile: null,
    entrySocketFile: null,
    errorHandlerFile: null,
  };
  let handlerFiles = [];
  let controllerFiles = [];

  // get middleware
  const mfs = config.filesStructure.middleware;
  const middlewareErr = 'Cant resolve socket middleware by path';
  const entryServerFilePath = path.join(rootPath, mfs.path, mfs.entryServerFile);
  middlewareFiles.entryServerFile = retrieveModule(entryServerFilePath, middlewareErr) || [];
  const entrySocketFilePath = path.join(rootPath, mfs.path, mfs.entrySocketFile);
  middlewareFiles.entrySocketFile = retrieveModule(entrySocketFilePath, middlewareErr) || [];
  const errorHandlerFilePath = path.join(rootPath, mfs.path, mfs.errorHandlerFile);
  middlewareFiles.errorHandlerFile = retrieveModule(errorHandlerFilePath, middlewareErr) || [];
  // get handlers
  handlerFiles = retrieveFilesFromDir(path.join(rootPath, config.filesStructure.handlers));
  handlerFiles = handlerFiles.map((v) => v.module);
  // get controllers
  controllerFiles = retrieveFilesFromDir(path.join(rootPath, config.filesStructure.controllers));

  // create and assemble server
  return (httpServer) => {
    const io = new Server(httpServer, socketConfig);
    const socketHandlerFactory = new SocketHandlerFactory(io, handlerFiles);

    // apply server middleware
    middlewareFiles.entryServerFile.forEach((middleware) => io.use(middleware));

    io.on('connection', (socket) => {
      // apply socket middleware
      middlewareFiles.entrySocketFile.forEach((middleware) => socket.use(middleware));
      // apply error handlers
      middlewareFiles.errorHandlerFile.forEach((middleware) => middleware(io, socket));
      // apply event handlers
      socketHandlerFactory.inject(socket);
    });

    // apply controllers
    applyControllers(controllerFiles, io);

    // ? apply namespaces
    //

    return io;
  };
};

module.exports = socketLoader;
