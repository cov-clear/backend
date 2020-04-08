import { Response } from 'express';
import { ApiError, apiErrorCodes } from '../dtos/ApiError';
import { AuthenticatedRequest } from '../../api/AuthenticatedRequest';

export async function isAuthenticated(req: AuthenticatedRequest, res: Response, next: (err?: any) => any) {
  if (!req.authentication) {
    next(new ApiError(401, apiErrorCodes.UNAUTHORIZED_ACCESS));
  }
  return next();
}
