import express, { Request, Response, Router } from 'express';
import { Inject, Service } from 'typedi';

import * as config from '../../config';
import logger from '../../infrastructure/logging/logger';
import { ApiError, apiErrorCodes } from '../../api/ApiError';
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

@Service()
export class RootController implements ApiController {
  constructor(private adminController: AdminController) {}

  public routes(): Router {
    return express()
      .use('', wrapAsyncFunction(attachAuthenticationToRequest))
      .use('/v1', accessPass())
      .use('/v1/admin', this.adminController.routes())
      .use('/v1', auth())
      .use('/v1', countries())
      .use('/v1', permissions())
      .use('/v1', roles())
      .use('/v1', sharingCode())
      .use('/v1', test())
      .use('/v1', testTypes())
      .use('/v1/users', user())
      .use(this.notFoundHandling())
      .use(this.errorHandling());
  }

  private notFoundHandling() {
    return (_: Request, __: Response, next: (...things: any[]) => any) => {
      next(new ApiError(404, apiErrorCodes.RESOURCE_NOT_FOUND, 'Not Found'));
    };
  }

  private errorHandling() {
    return (err: Error, _: Request, res: Response, next: (...things: any[]) => any) => {
      if (res.headersSent) {
        return next(err);
      }
      const status = ((err as any).status as number) || 500;
      const code = ((err as any).code as string) || 'unexpected.error';

      if (status >= 500) {
        logger.error('Internal Error', err);
      }

      const body: any = { code };
      if (config.isDevelopment) {
        body.stack = err.stack;
      }
      res.status(status);
      res.json(body);
    };
  }
}
