import express, { Request, Response } from 'express';
import securityHeaders from 'helmet';
import * as config from '../config';
import routes from '../api';
import logger from '../logger';
import { ApiError, defaultStatusMessages } from '../api/ApiError';

export default () => {
  return express()
    .use(securityHeaders())
    .use('/api', routes())
    .use(notFoundHandling())
    .use(errorHandling());
};

function notFoundHandling() {
  return (_: Request, __: Response, next: (...things: any[]) => any) => {
    next(new ApiError(404, 'Not Found'));
  };
}

function errorHandling() {
  return (
    err: Error,
    _: Request,
    res: Response,
    next: (...things: any[]) => any
  ) => {
    if (res.headersSent) {
      return next(err);
    }
    const status = ((err as any).status as number) || 500;
    const message =
      err.message ||
      defaultStatusMessages[status] ||
      defaultStatusMessages[500];
    if (status >= 500) {
      if (err.stack) {
        logger.error(err.stack);
      } else {
        logger.error(message);
      }
    }
    const body: any = { message };
    if (config.isDevelopment) {
      body.stack = err.stack;
    }
    res.status(status);
    res.json(body);
  };
}
