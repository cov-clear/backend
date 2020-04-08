import { Request } from 'express';
import * as core from 'express-serve-static-core';
import { Authentication } from '../domain/model/authentication/Authentication';
import { ApiError, apiErrorCodes } from '../presentation/dtos/ApiError';

export interface AuthenticatedRequest<P extends core.Params = core.ParamsDictionary> extends Request<P> {
  authentication?: Authentication;
}

export function getAuthenticationOrFail(request: AuthenticatedRequest) {
  if (!request.authentication) {
    throw new ApiError(401, apiErrorCodes.UNAUTHORIZED_ACCESS);
  }
  return request.authentication;
}
