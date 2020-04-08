import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { UserNotFoundError } from '../../../domain/model/user/UserRepository';
import { ApiError, apiErrorCodes } from '../../../api/ApiError';
import { AccessDeniedError } from '../../../domain/model/AccessDeniedError';
import { ResourceNotFoundError } from '../../../domain/model/ResourceNotFoundError';
import { DomainValidationError } from '../../../domain/model/DomainValidationError';

@Middleware({ type: 'after' })
export class UserErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next: (err?: any) => any): void {
    if (error instanceof UserNotFoundError) {
      return next(new ApiError(404, apiErrorCodes.USER_NOT_FOUND));
    }
    if (error instanceof AccessDeniedError) {
      return next(new ApiError(403, apiErrorCodes.ACCESS_DENIED));
    }
    if (error instanceof ResourceNotFoundError) {
      return next(new ApiError(422, `${error.resourceName}.not-found`));
    }
    if (error instanceof DomainValidationError) {
      return next(new ApiError(422, `invalid.${error.field}`, error.reason));
    }
    return next(error);
  }
}
