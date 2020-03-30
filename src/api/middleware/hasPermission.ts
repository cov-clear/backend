import { Response } from 'express';
import {
  AuthenticatedRequest,
  getAuthenticationOrFail,
} from '../AuthenticatedRequest';
import { ApiError, apiErrorCodes } from '../ApiError';

export function hasPermission(neededPermissionName: string) {
  return async (req: AuthenticatedRequest, res: Response, next: () => any) => {
    const authentication = getAuthenticationOrFail(req);
    const hasPermission: boolean = !!authentication.permissions.find(
      (permissionName) => permissionName === neededPermissionName
    );
    if (!hasPermission) {
      throw new ApiError(403, apiErrorCodes.ACCESS_DENIED);
    }
    return next();
  };
}
