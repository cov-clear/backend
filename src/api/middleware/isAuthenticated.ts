import { Response } from 'express';
import { ApiError } from '../ApiError';
import { AuthenticatedRequest } from '../AuthenticatedRequest';

export async function isAuthenticated(
  req: AuthenticatedRequest,
  res: Response,
  next: () => any
) {
  if (!req.authentication) {
    throw new ApiError(401, 'authentication.missing');
  }
  return next();
}
