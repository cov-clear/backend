import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { ApiError } from '../../dtos/ApiError';
import { DomainValidationError } from '../../../domain/model/DomainValidationError';
import { AuthorisationFailedError } from '../../../application/service/authentication/ExchangeAuthCode';
import { ResourceNotFoundError } from '../../../domain/model/ResourceNotFoundError';

@Middleware({ type: 'after' })
export class AuthenticationErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next: (err?: any) => any): void {
    if (error instanceof AuthorisationFailedError) {
      next(new ApiError(422, error.failureReason.toString()));
    }
    if (error instanceof ResourceNotFoundError) {
      next(new ApiError(422, `${error.resourceName}.not-found`));
    }
    if (error instanceof DomainValidationError) {
      next(new ApiError(422, `invalid.${error.field}`, error.reason));
    }
    next(error);
  }
}
