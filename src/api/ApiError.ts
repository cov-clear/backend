import { HttpError } from 'routing-controllers';

export class ApiError extends HttpError {
  constructor(public httpCode: number = 500, public code: string, public message: string = code) {
    super(httpCode, `${httpCode} - ${code} - ${message}`);
  }
}

export const apiErrorCodes = {
  ACCESS_DENIED: 'access.denied',
  UNAUTHORIZED_ACCESS: 'access.unauthorized',

  USER_NOT_FOUND: 'user.not-found',
  ROLE_NOT_FOUND: 'role.not-found',
  PERMISSION_NOT_FOUND: 'permission.not-found',
  RESOURCE_NOT_FOUND: 'resource.not-found',
  TEST_NOT_FOUND: 'test.not-found',

  TEST_TYPE_NAME_CONFLICT: 'test-type.name-already-exists',
};
