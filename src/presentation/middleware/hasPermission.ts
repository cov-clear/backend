import { ApiError, apiErrorCodes } from '../dtos/ApiError';
import { Authentication } from '../../domain/model/authentication/Authentication';

export function hasPermission(neededPermissionName: string) {
  return async (req: any, res: any, next: (err?: any) => any) => {
    try {
      const authentication = req.authentication as Authentication | null;
      if (!authentication) {
        return next(new ApiError(401, apiErrorCodes.UNAUTHORIZED_ACCESS));
      }

      const hasPermission: boolean = !!authentication.permissions?.find(
        (permissionName) => permissionName === neededPermissionName
      );

      if (!hasPermission) {
        return next(new ApiError(403, apiErrorCodes.ACCESS_DENIED));
      }
      return next();
    } catch (error) {
      next(error);
    }
  };
}
