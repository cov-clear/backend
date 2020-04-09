import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { ApiError, apiErrorCodes } from '../../dtos/ApiError';
import { RoleNotFoundError } from '../../../domain/model/authentication/RoleRepository';
import { AccessDeniedError } from '../../../domain/model/AccessDeniedError';
import { DomainValidationError } from '../../../domain/model/DomainValidationError';
import { PermissionNotFoundError } from '../../../domain/model/authentication/PermissionNotFoundError';

@Middleware({ type: 'after' })
export class PermissionErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next: (err?: any) => any): void {
    if (error instanceof RoleNotFoundError) {
      next(new ApiError(404, apiErrorCodes.ROLE_NOT_FOUND));
    }
    if (error instanceof PermissionNotFoundError) {
      next(new ApiError(422, apiErrorCodes.PERMISSION_NOT_FOUND));
    }
    if (error instanceof AccessDeniedError) {
      next(new ApiError(403, apiErrorCodes.ACCESS_DENIED));
    }
    if (error instanceof DomainValidationError) {
      next(new ApiError(422, `role.invalid.${error.field}`));
    }
    next(error);
  }
}
