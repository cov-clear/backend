import jwt from 'jsonwebtoken';
import * as config from '../../config';
import { Request, Response } from 'express';
import logger from '../../infrastructure/logging/logger';
import { userRepository } from '../../infrastructure/persistence';
import { UserId } from '../../domain/model/user/UserId';
import { Authentication } from '../../domain/model/authentication/Authentication';

const jwtSecret: string = config.get('jwt.secret');

/**
 * Extracts, validates and decodes the Bearer Authorization JWT if present
 * Attempts to find the user mentioned by the userId property in the JWT.
 *
 * If a user is found an {@link Authorization} object is created and attached to the request object
 *
 * THe {@link Authorization} object is later used by {@link CurrentUserChecker} an {@link AuthorizationChecker}
 */
export const attachAuthenticationToRequest = wrapAsyncFunction(attachAuthenticationToRequestAsync);

async function attachAuthenticationToRequestAsync(req: Request, res: Response, next: (err?: any) => any) {
  try {
    const token = getTokenFromHeader(req);
    if (!token) {
      return next();
    }
    const decoded = jwt.verify(token, jwtSecret) as any;
    const userId = decoded.userId as string;
    const user = await userRepository.findByUserId(new UserId(userId));
    if (!user) {
      return next();
    }

    Reflect.set(req, 'authentication', new Authentication(user, user.roles, user.permissions));
    return next();
  } catch (tokenError) {
    logger.error(`Failed to authenticate`, tokenError);
    next(tokenError);
  }
}

function getTokenFromHeader(req: Request) {
  const tokenParts = req.headers.authorization?.split(' ').map((part) => part.trim());
  if (tokenParts && tokenParts[0] === 'Bearer') {
    return tokenParts[1];
  }
  return null;
}

function wrapAsyncFunction(fn: (req: Request, res: Response, next: () => any) => Promise<any>) {
  return (req: Request, res: Response, next: () => any) => {
    fn(req, res, next).catch(next);
  };
}
