import express, { Router } from 'express';

import * as config from '../../config';
import logger from '../../infrastructure/logging/logger';
import { attachAuthenticationToRequest } from '../middleware/attachAuthenticationToRequest';
import { wrapAsyncFunction } from '../../api/AsyncRouter';

import { ApiController } from './ApiController';
import { AdminController } from './admin/AdminController';
import auth from '../../api/routes/auth';
import permissions from '../../api/routes/permissions';
import roles from '../../api/routes/roles';
import { ExpressErrorMiddlewareInterface, Middleware, useExpressServer } from 'routing-controllers';
import { UserController } from './users/UserController';
import { TestController } from './tests/TestController';
import { TestTypeController } from './tests/TestTypeController';
import { CountryController } from './users/CountryController';
import { AccessPassController } from './access-sharing/AccessPassController';
import { SharingCodeController } from './access-sharing/SharingCodeController';

export class RootController implements ApiController {
  public routes(): Router {
    const expressApp = express()
      .use('', wrapAsyncFunction(attachAuthenticationToRequest))
      .use('/v1', auth())
      .use('/v1', permissions())
      .use('/v1', roles());

    useExpressServer(expressApp, {
      controllers: [
        AdminController,
        UserController,
        TestController,
        TestTypeController,
        CountryController,
        AccessPassController,
        SharingCodeController,
      ],
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
