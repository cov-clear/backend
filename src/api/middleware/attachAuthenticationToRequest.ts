import jwt from 'jsonwebtoken';
import * as config from '../../config';
import { Request, Response } from 'express';
import logger from '../../logger';
import { userRepository } from '../../infrastructure/persistence';
import { UserId } from '../../domain/model/user/UserId';
import { AuthenticatedRequest } from '../AuthenticatedRequest';
import { Authentication } from '../../domain/model/authentication/Authentication';

const jwtSecret: string = config.get('jwt.secret');

function getTokenFromHeader(req: Request) {
  const tokenParts = req.headers.authorization?.split(' ').map((part) => part.trim());
  if (tokenParts && tokenParts[0] === 'Bearer') {
    return tokenParts[1];
  }
  return null;
}

export async function attachAuthenticationToRequest(req: AuthenticatedRequest, res: Response, next: () => any) {
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

    req.authentication = new Authentication(user, user.roles, user.permissions);
    return next();
  } catch (tokenError) {
    logger.error(`Failed to authenticate`, tokenError);
    next();
  }
}
