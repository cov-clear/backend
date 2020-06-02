import express, { Application } from 'express';
import { attachAuthenticationToRequest } from '../middleware/attachAuthenticationToRequest';

import { AdminController } from './admin/AdminController';
import { ServiceConfigController } from './config/ServiceConfigController';
import { useExpressServer } from 'routing-controllers';
import { UserController } from './users/UserController';
import { TestController } from './tests/TestController';
import { TestTypeController } from './tests/TestTypeController';
import { CountryController } from './users/CountryController';
import { StatisticsController } from './statistics/StatisticsController';
import { AccessPassController } from './access-sharing/AccessPassController';
import { SharingCodeController } from './access-sharing/SharingCodeController';
import { AuthenticationController } from './authentication/AuthenticationController';
import { PermissionController } from './authorization/PermissionController';
import { RoleController } from './authorization/RoleController';
import { HealthController } from './HealthController';
import { ErrorHandlingMiddleware } from '../middleware/ErrorHandlingMiddleware';
import { AuthorizationChecker } from '../middleware/AuthorizationChecker';
import { CurrentUserChecker } from '../middleware/CurrentUserChecker';
import { rollbarClient } from '../../infrastructure/logging/Rollbar';
import securityHeaders from 'helmet';
import logger from '../../infrastructure/logging/logger';
import { ReportsController } from './reports/ReportsController';

export class RootController {
  public expressApp(): Application {
    const authorizationChecker = new AuthorizationChecker();
    const currentUserChecker = new CurrentUserChecker();

    const expressApp = express().use(securityHeaders()).use(logger.expressPlugin()).use(attachAuthenticationToRequest);

    useExpressServer(expressApp, {
      routePrefix: '/api',
      controllers: [
        HealthController,
        AccessPassController,
        ServiceConfigController,
        AdminController,
        AuthenticationController,
        CountryController,
        PermissionController,
        RoleController,
        SharingCodeController,
        TestController,
        TestTypeController,
        UserController,
        ReportsController,
        StatisticsController,
      ],
      defaultErrorHandler: false,
      middlewares: [ErrorHandlingMiddleware],
      authorizationChecker: authorizationChecker.hasValidToken.bind(authorizationChecker),
      currentUserChecker: currentUserChecker.getUser.bind(currentUserChecker),
    });

    expressApp.use(rollbarClient.errorHandler());

    return expressApp;
  }
}
