import express, { Router } from 'express';

import * as config from '../../config';
import logger from '../../infrastructure/logging/logger';
import { attachAuthenticationToRequest } from '../../api/middleware/attachAuthenticationToRequest';
import { wrapAsyncFunction } from '../../api/AsyncRouter';

import accessPass from '../../api/routes/accessPass';
import { ApiController } from './ApiController';
import { AdminController } from './AdminController';
import auth from '../../api/routes/auth';
import countries from '../../api/routes/countries';
import permissions from '../../api/routes/permissions';
import roles from '../../api/routes/roles';
import sharingCode from '../../api/routes/sharingCode';
import test from '../../api/routes/test';
import testTypes from '../../api/routes/testTypes';
import user from '../../api/routes/user';
import { ExpressErrorMiddlewareInterface, Middleware, useExpressServer } from 'routing-controllers';

export class RootController implements ApiController {
  public routes(): Router {
    const expressApp = express()
      .use('', wrapAsyncFunction(attachAuthenticationToRequest))
      .use('/v1', accessPass())
      .use('/v1', auth())
      .use('/v1', countries())
      .use('/v1', permissions())
      .use('/v1', roles())
      .use('/v1', sharingCode())
      .use('/v1', test())
      .use('/v1', testTypes())
      .use('/v1/users', user());

    useExpressServer(expressApp, {
      controllers: [AdminController],
      defaultErrorHandler: false,
      middlewares: [ErrorHandlingMiddleware],
    });

    return expressApp;
  }
}

@Middleware({ type: 'after' })
export class ErrorHandlingMiddleware implements ExpressErrorMiddlewareInterface {
  error(err: any, req: any, res: any, next: (err?: any) => any): void {
    if (res.headersSent) {
      return next(err);
    }
    const httpCode = ((err as any).httpCode as number) || 500;
    const code = ((err as any).code as string) || 'unexpected.error';

    if (httpCode >= 500) {
      logger.error('Internal Error', err);
    }

    const body: any = { code };
    if (config.isDevelopment) {
      body.stack = err.stack;
    }

    res.status(httpCode);
    res.json(body);
  }
}
