import { Response } from 'express';
import { AuthenticatedRequest, getAuthenticationOrFail } from '../AuthenticatedRequest';
import { ApiError, apiErrorCodes } from '../ApiError';

export function hasPermission(neededPermissionName: string) {
  return async (req: AuthenticatedRequest, res: Response, next: (err?: any) => any) => {
    try {
      const authentication = getAuthenticationOrFail(req);
      const hasPermission: boolean = !!authentication.permissions.find(
        (permissionName) => permissionName === neededPermissionName
      );
      if (!hasPermission) {
        next(new ApiError(403, apiErrorCodes.ACCESS_DENIED));
      }
      return next();
    } catch (error) {
      next(error);
    }
  };
}
