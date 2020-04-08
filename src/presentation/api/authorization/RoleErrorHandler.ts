import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { UserNotFoundError } from '../../../domain/model/user/UserRepository';
import { ApiError, apiErrorCodes } from '../../dtos/ApiError';
import { RoleNotFoundError } from '../../../domain/model/authentication/RoleRepository';
import { AccessDeniedError } from '../../../domain/model/AccessDeniedError';
import { DomainValidationError } from '../../../domain/model/DomainValidationError';

@Middleware({ type: 'after' })
export class RoleErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next: (err?: any) => any): void {
    if (error instanceof UserNotFoundError) {
      next(new ApiError(404, apiErrorCodes.USER_NOT_FOUND));
    }
    if (error instanceof RoleNotFoundError) {
      next(new ApiError(422, apiErrorCodes.ROLE_NOT_FOUND));
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
