require('colors');

const path = require('path');
const debug = require('debug');
const winston = require('winston');
const moment = require('moment');
const DailyRotateFile = require('winston-daily-rotate-file');

const loggerConfig = require('../config/logger.config');

class Logger {
  constructor(logPath = loggerConfig.logPath) {
    this.winston = Logger.buildLogger({ logPath });
    this.debug = debug('app');
  }

  static buildLogger({ logPath, parseArgs = true, logInConsole = true } = {}) {
    const transports = [];

    if (logPath) {
      transports.push(Logger.getDebugTransport(logPath));
      transports.push(Logger.getInfoTransport(logPath));
      transports.push(Logger.getWarnTransport(logPath));
      transports.push(Logger.getErrorTransport(logPath));
    }

    if (logInConsole && !loggerConfig.console.blackListModes.includes(process.env.NODE_ENV)) {
      transports.push(Logger.getConsoleTransport());
    }

    return winston.createLogger({
      format: Logger.getFormat(parseArgs),
      transports,
    });
  }

  static assembleLogOutput(info, parseArgs = true, getTime) {
    const { timestamp, level, message, code, stack, ...args } = info;
    let ts = getTime ? getTime(timestamp, info) : timestamp;
    let output = message;

    if (code) output += `\ncode: ${code}`;
    if (stack) output += `\n${stack}`;
    if (parseArgs && Object.keys(args).length) output += `\n ${JSON.stringify(args, null, 2)}`;

    return `[${level}] :: ${ts} :: ${output}`;
  }

  static getFormat(parseArgs = true) {
    const timeFormatter = (timestamp) => {
      return moment(timestamp).format('YYYY-MM-DD HH:mm:ss (Z)');
    };

    const printf = (info) => {
      return Logger.assembleLogOutput(info, parseArgs, timeFormatter);
    };

    return winston.format.combine(winston.format.timestamp(), winston.format.printf(printf));
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
    const timeFormatter = (timestamp) => {
      return moment(timestamp).format('MM.DD.YYYY, HH:mm:ss').cyan;
    };

    const printf = (info) => {
      return Logger.assembleLogOutput(info, parseArgs, timeFormatter);
    };

    return new winston.transports.Console({
      format: winston.format.combine(
        winston.format.printf(printf),
        winston.format.colorize({ all: true })
      ),
    });
  }

  get middlewareOutput() {
    return 'PATH::url [:method] :: status::status :: size::res[content-length] :: :response-time ms';
  }

  getDebug(namespace) {
    return this.debug.extend(namespace);
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

  log(level, message) {
    this.winston.log({ level, message });
  }
}

module.exports = new Logger();
