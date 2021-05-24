const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');

const logger = require('../libs/Logger');
const socketConfig = require('../config/socket.config');

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
    rooms: '/rooms',
    events: '/events',
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

const initiateClasses = (moduleArray, error = (err, ModuleFile) => null, ...args) => {
  return moduleArray
    .map((ModuleFile) => {
      try {
        return new ModuleFile.module(args);
      } catch (err) {
        logger.warn(error(err, ModuleFile));
        return null;
      }
    })
    .filter((val) => val !== null);
};

const applyControllers = (controllerFiles, server, context) => {
  const processObject = (controller) => {
    if (typeof controller === 'function') {
      controller(server, context);
    } else if (typeof controller === 'object') {
      for (let name in controller) processObject(controller[name]);
    }
  };

  controllerFiles.forEach(processObject);
};

const socketLoader = (relativePath = __dirname, config = DEFAULT_CONFIG) => {
  const rootPath = path.resolve(relativePath, config.pathPattern);

  // get (import) all files
  const middlewareFiles = {
    entryServerFile: null,
    entrySocketFile: null,
    errorHandlerFile: null,
  };
  let roomFiles = [];
  let eventFiles = [];
  let controllerFiles = [];

  // get middleware
  const mfs = config.filesStructure.middleware;
  const middlewareErr = 'Cant resolve socket middleware by path';
  const entryServerFilePath = path.join(rootPath, mfs.path, mfs.entryServerFile);
  middlewareFiles.entryServerFile = retrieveModule(entryServerFilePath, middlewareErr);
  const entrySocketFilePath = path.join(rootPath, mfs.path, mfs.entrySocketFile);
  middlewareFiles.entrySocketFile = retrieveModule(entrySocketFilePath, middlewareErr);
  const errorHandlerFilePath = path.join(rootPath, mfs.path, mfs.errorHandlerFile);
  middlewareFiles.errorHandlerFile = retrieveModule(errorHandlerFilePath, middlewareErr);
  // get rooms
  roomFiles = retrieveFilesFromDir(path.join(rootPath, config.filesStructure.rooms));
  // get events
  eventFiles = retrieveFilesFromDir(path.join(rootPath, config.filesStructure.events));
  // get controllers
  controllerFiles = retrieveFilesFromDir(path.join(rootPath, config.filesStructure.controllers));

  // create and assemble server
  return (httpServer) => {
    const io = new Server(httpServer, socketConfig);
    // apply server middleware
    middlewareFiles.entryServerFile.forEach((middleware) => io.use(middleware));

    io.on('connection', (socket) => {
      // apply socket middleware
      middlewareFiles.entrySocketFile.forEach((middleware) => socket.use(middleware));
      // apply error handlers
      middlewareFiles.errorHandlerFile.forEach((middleware) => middleware(io, socket));
    });

    // setup rooms
    const roomsCtx = initiateClasses(
      roomFiles,
      (err, ModuleFile) => `Socket room '${ModuleFile.file}' was not setup.`,
      io
    );

    // setup events
    const eventsCtx = initiateClasses(
      eventFiles,
      (err, ModuleFile) => `Socket event '${ModuleFile.file}' was not setup.`
    );

    const ctx = { rooms: roomsCtx, events: eventsCtx };

    // apply controllers
    applyControllers(controllerFiles, io, ctx);

    // ? apply namespaces
    //

    return io;
  };
};

module.exports = socketLoader;
