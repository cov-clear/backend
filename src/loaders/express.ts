import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import securityHeaders from 'helmet';

import * as config from '../config';
import logger from '../logger';
import routes from '../api';
import { ApiError } from '../api/ApiError';
import { attachAuthenticationToRequest } from '../api/middleware/attachAuthenticationToRequest';
import { wrapAsyncFunction } from '../api/AsyncRouter';

export default () => {
  return express()
    .use(securityHeaders())
    .use(bodyParser.json())
    .use(logger.expressPlugin())
    .use('/api', wrapAsyncFunction(attachAuthenticationToRequest))
    .use('/api', routes())
    .use(notFoundHandling())
    .use(errorHandling());
};

function notFoundHandling() {
  return (_: Request, __: Response, next: (...things: any[]) => any) => {
    next(new ApiError(404, 'resource.not-found', 'Not Found'));
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
    const code = ((err as any).code as string) || 'unexpected.error';

    if (status >= 500) {
      if (err.stack) {
        logger.error(err.stack);
      } else {
        logger.error(err);
      }
    }

    const body: any = { code };
    if (config.isDevelopment) {
      body.stack = err.stack;
    }
    res.status(status);
    res.json(body);
  };
}
