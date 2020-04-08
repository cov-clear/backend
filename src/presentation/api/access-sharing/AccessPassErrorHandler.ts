import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { ApiError } from '../../../api/ApiError';
import { DomainValidationError } from '../../../domain/model/DomainValidationError';
import { AccessPassFailedError } from '../../../application/service/access-sharing/CreateAccessPass';

@Middleware({ type: 'after' })
export class AccessPassErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next: (err?: any) => any): void {
    if (error instanceof AccessPassFailedError) {
      next(new ApiError(422, error.failureReason));
    }
    if (error instanceof DomainValidationError) {
      next(new ApiError(422, `invalid.${error.field}`, error.reason));
    }
    next(error);
  }
}
