import { default as pino } from 'pino';
import { default as expressPinoLogger } from 'express-pino-logger';

import * as config from './config';

const logger = pino({
  level: config.get('logLevels.messages'),
  prettyPrint: {
    colorize: true,
    ignore: 'pid,hostname',
    translateTime: true,
  },
});

function expressPlugin() {
  return expressPinoLogger({
    level: config.get('logLevels.requests'),
    logger,
  });
}

function info(message?: any, ...optionalParams: any[]): void {
  logger.info(message, ...optionalParams);
}

function error(message?: any, ...optionalParams: any[]): void {
  logger.error(message, ...optionalParams);
}

function warn(message?: any, ...optionalParams: any[]): void {
  logger.warn(message, ...optionalParams);
}

export default {
  info,
  error,
  warn,
  expressPlugin,
};
