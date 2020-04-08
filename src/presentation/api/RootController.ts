import express, { Router } from 'express';

import * as config from '../../config';
import logger from '../../infrastructure/logging/logger';
import { attachAuthenticationToRequest } from '../middleware/attachAuthenticationToRequest';
import { wrapAsyncFunction } from '../../api/AsyncRouter';

import { ApiController } from './ApiController';
import { AdminController } from './admin/AdminController';
import { ExpressErrorMiddlewareInterface, Middleware, useExpressServer } from 'routing-controllers';
import { UserController } from './users/UserController';
import { TestController } from './tests/TestController';
import { TestTypeController } from './tests/TestTypeController';
import { CountryController } from './users/CountryController';
import { AccessPassController } from './access-sharing/AccessPassController';
import { SharingCodeController } from './access-sharing/SharingCodeController';
import { AuthenticationController } from './authentication/AuthenticationController';
import { PermissionController } from './authorization/PermissionController';
import { RoleController } from './authorization/RoleController';

export class RootController implements ApiController {
  public routes(): Router {
    const expressApp = express().use('', wrapAsyncFunction(attachAuthenticationToRequest));

    useExpressServer(expressApp, {
      controllers: [
        AccessPassController,
        AdminController,
        AuthenticationController,
        CountryController,
        PermissionController,
        RoleController,
        SharingCodeController,
        TestController,
        TestTypeController,
        UserController,
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
