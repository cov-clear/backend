import { AuthenticationMethodType } from './AuthenticationMethod';
import { AuthenticationIdentifier } from './AuthenticationIdentifier';

export class AuthenticationDetails {
  constructor(readonly method: AuthenticationMethodType, readonly identifier: AuthenticationIdentifier) {}
}
