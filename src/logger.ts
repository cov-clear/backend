import { default as pino } from 'pino';
import { default as expressPinoLogger } from 'express-pino-logger';

import * as config from './config';

const logger = pino(pinoConfig(config));

function pinoConfig(config: any): pino.LoggerOptions {
  const cfg: pino.LoggerOptions = {
    level: config.get('logLevels.messages'),
  };

  try {
    // Enable pretty printing only if the module is installed
    require.resolve('pino-pretty');

    cfg.prettyPrint = {
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: true,
    };
  } catch (e) {}

  return cfg;
}

function expressPlugin(): expressPinoLogger.HttpLogger {
  return expressPinoLogger({
    level: config.get('logLevels.requests'),
    logger,
  });
}

function info(message: string): void {
  logger.info(message);
}

function error(message: string, err?: Error): void {
  logger.error({ err }, message);
}

function warn(message: string): void {
  logger.warn(message);
}

export default {
  info,
  error,
  warn,
  expressPlugin,
};
