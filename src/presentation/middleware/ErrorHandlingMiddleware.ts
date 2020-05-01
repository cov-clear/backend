import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import logger from '../../infrastructure/logging/logger';
import * as config from '../../config';

@Middleware({ type: 'after' })
export class ErrorHandlingMiddleware implements ExpressErrorMiddlewareInterface {
  error(err: any, req: any, res: any, next: (err?: any) => any): void {
    if (res.headersSent) {
      return next(err);
    }
    const httpCode = (err.httpCode as number) || 500;
    const code = err.code as string;
    const message = err.message;

    if (httpCode >= 500) {
      logger.error('Internal Error', err);
    }

    const body: any = { code, message };
    if (config.isDevelopment()) {
      body.stack = err.stack;
    }

    res.status(httpCode);
    res.json(body);
  }
}
