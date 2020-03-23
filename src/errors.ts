import logger from './logger';
import { isDevelopment } from './config';
import { Response, Request } from 'express';

const defaultStatusMessages: { [key: string]: string } = {
  404: 'Not found',
  500: 'Internal server error',
};

export class ApplicationError extends Error {
  constructor(public status: number = 500, public message: string = defaultStatusMessages[500]) {
    super(message);
  }
}

export function errorHandling() {
  return (err: Error, _: Request, res: Response, next: (...things: any[]) => any) => {
    if (res.headersSent) {
      return next(err);
    }
    const status = ((err as any).status as number) || 500;
    const message = err.message || defaultStatusMessages[status] || defaultStatusMessages[500];
    if (status >= 500) {
      if (err.stack) {
        logger.error(err.stack);
      } else {
        logger.error(message);
      }
    }
    const body: any = { message };
    if (isDevelopment) {
      body.stack = err.stack;
    }
    res.status(status);
    res.json(body);
  };
}

export function notFoundHandling() {
  return (_: Request, __: Response, next: (...things: any[]) => any) => {
    next(new ApplicationError(404, 'Not Found'));
  };
}
