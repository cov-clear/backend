import { default as pino } from 'pino';
import { default as expressPinoLogger } from 'express-pino-logger';
import * as config from '../../config';
import { rollbarClient } from './Rollbar';

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

function info(message: string): void {
  logger.info(message);
}

function error(message: string, err?: Error): void {
  sendErrorToRollbar(message, err);

  logger.error({ err }, message);
}

function warn(message: string): void {
  logger.warn(message);
}

function expressPlugin(): expressPinoLogger.HttpLogger {
  return expressPinoLogger({
    level: config.get('logLevels.requests'),
    logger,
  });
}

function sendErrorToRollbar(message: string, err?: Error) {
  if (err) {
    rollbarClient.error(message, err);
  } else {
    rollbarClient.error(message);
  }
}

export default {
  info,
  error,
  warn,
  expressPlugin,
};
