import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { ApiError, apiErrorCodes } from '../../dtos/ApiError';
import { AccessDeniedError } from '../../../domain/model/AccessDeniedError';
import { ResourceNotFoundError } from '../../../domain/model/ResourceNotFoundError';
import { DomainValidationError } from '../../../domain/model/DomainValidationError';
import { TestNotFoundError } from '../../../domain/model/test/TestNotFoundError';

@Middleware({ type: 'after' })
export class TestErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next: (err?: any) => any): void {
    if (error instanceof TestNotFoundError) {
      next(new ApiError(404, apiErrorCodes.TEST_NOT_FOUND));
    }
    if (error instanceof AccessDeniedError) {
      next(new ApiError(403, apiErrorCodes.ACCESS_DENIED));
    }
    if (error instanceof ResourceNotFoundError) {
      next(new ApiError(422, `${error.resourceName}.not-found`));
    }
    if (error instanceof DomainValidationError) {
      next(new ApiError(422, `invalid.${error.field}`, error.reason));
    }
    return next(error);
  }
}
