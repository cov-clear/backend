import { Action } from 'routing-controllers';
import { Authentication } from '../../domain/model/authentication/Authentication';
import { ApiError, apiErrorCodes } from '../dtos/ApiError';

/**
 * Used to make the `@Authorized` decorators work in controllers
 *
 * Also {@see attachAuthenticationToRequest}
 */
export class AuthorizationChecker {
  async hasValidToken(action: Action): Promise<boolean> {
    const authentication: Authentication = action.request.authentication;
    if (!authentication?.user) {
      throw new ApiError(401, apiErrorCodes.UNAUTHORIZED_ACCESS);
    }
    return true;
  }
}
