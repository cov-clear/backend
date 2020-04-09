import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { ApiError, apiErrorCodes } from '../../dtos/ApiError';
import { DomainValidationError } from '../../../domain/model/DomainValidationError';
import { TestTypeNameAlreadyExists } from '../../../domain/model/test/testType/TestTypeRepository';

@Middleware({ type: 'after' })
export class TestTypeErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next: (err?: any) => any): void {
    if (error instanceof TestTypeNameAlreadyExists) {
      next(new ApiError(409, apiErrorCodes.TEST_TYPE_NAME_CONFLICT));
    }
    if (error instanceof DomainValidationError) {
      next(new ApiError(422, `invalid.${error.field}`, error.reason));
    }
    return next(error);
  }
}
