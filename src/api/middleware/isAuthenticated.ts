import { Request, Response } from 'express';
import { Authentication } from '../../domain/model/authentication/Authentication';
import { ApiError } from '../ApiError';

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: () => any
) {
  const authentication = Reflect.get(req, 'authentication') as Authentication;
  if (!authentication) {
    throw new ApiError(401, 'authentication.missing');
  }
  return next();
}
