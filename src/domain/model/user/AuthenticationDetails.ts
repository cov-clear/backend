import { AuthenticationMethod } from './AuthenticationMethod';
import { AuthenticationIdentifier } from './AuthenticationIdentifier';
import { DomainValidationError } from '../DomainValidationError';

export class AuthenticationDetails {
  constructor(readonly method: AuthenticationMethod, readonly identifier: AuthenticationIdentifier) {
    if (!method.supported) {
      throw new DomainValidationError(
        'authenticationDetails.method',
        `Authentication method not supported: ${method.type}`
      );
    }
  }
}
