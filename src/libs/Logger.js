require('dotenv').config();
require('colors');

const path = require('path');
const winston = require('winston');
const moment = require('moment');
const DailyRotateFile = require('winston-daily-rotate-file');
const singleton = require('../utils/singleton');

const LOG_PATH = path.join(__dirname, '../../logs');

class Logger {
  constructor(logPath = LOG_PATH) {
    this.winston = Logger.buildLogger({ logPath });
  }

  static buildLogger({ logPath, parseArgs = true, logInConsole = true } = {}) {
    const transports = [];

    if (logPath) {
      transports.push(Logger.getDebugTransport(logPath));
      transports.push(Logger.getInfoTransport(logPath));
      transports.push(Logger.getWarnTransport(logPath));
      transports.push(Logger.getErrorTransport(logPath));
    }

    if (logInConsole) {
      transports.push(Logger.getConsoleTransport());
    }

    return winston.createLogger({
      format: Logger.getFormat(parseArgs),
      transports,
    });
  }

  static getFormat(parseArgs = true) {
    const assembleLogOutput = (info) => {
      const { timestamp, level, message, ...args } = info;
      const ts = moment(timestamp).format('YYYY-MM-DD HH:mm:ss (Z)');

      return `[${level}] :: ${ts} :: ${message} ${
        parseArgs ? (Object.keys(args).length ? JSON.stringify(args, null, 2) : '') : ''
      }`;
    };

    return winston.format.combine(winston.format.timestamp(), winston.format.printf(assembleLogOutput));
  }

  static getDebugTransport(logPath) {
    return Logger.getFileTransport(logPath, 'debug');
  }

  static getInfoTransport(logPath) {
    return Logger.getFileTransport(logPath, 'info');
  }

  static getWarnTransport(logPath) {
    return Logger.getFileTransport(logPath, 'warn');
  }

  static getErrorTransport(logPath) {
    return Logger.getFileTransport(logPath, 'error');
  }

  static getFileTransport(
    logPath,
    level,
    config = {
      datePattern: 'DD-MM-YYYY',
      maxFiles: '90d',
      maxSize: '20m',
      zippedArchive: true,
    }
  ) {
    return new DailyRotateFile(
      Object.assign(
        {
          filename: path.join(logPath, level, `${level}-%DATE%.log`),
          level,
        },
        config
      )
    );
  }

  static getConsoleTransport(parseArgs = true) {
    const assembleLogOutput = (info) => {
      const { timestamp, level, message, ...args } = info;
      const ts = moment(timestamp).format('MM.DD.YYYY, HH:mm:ss');

      return `[${level}] ${ts.cyan} ${message} ${
        parseArgs ? (Object.keys(args).length ? JSON.stringify(args, null, 2) : '') : ''
      }`;
    };

    return new winston.transports.Console({
      format: winston.format.combine(winston.format.printf(assembleLogOutput), winston.format.colorize({ all: true })),
    });
  }

  static get middlewareOutput() {
    return 'PATH::url [:method] :: status::status :: size::res[content-length] :: :response-time ms';
  }

  stream() {
    return {
      write: (message, encoding) => {
        this.info(message.replace(/\n/g, ''));
      },
    };
  }

  error(message, ...args) {
    this.winston.error(message, ...args);
  }

  warn(message, ...args) {
    this.winston.warn(message, ...args);
  }

  info(message, ...args) {
    this.winston.info(message, ...args);
  }

  debug(message, ...args) {
    this.winston.debug(message, ...args);
  }

  log(level, message) {
    this.winston.log({ level, message });
  }
}

module.exports = singleton(Logger);
