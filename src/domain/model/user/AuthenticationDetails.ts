import { AuthenticationMethod } from './AuthenticationMethod';
import { AuthenticationIdentifier } from './AuthenticationIdentifier';

export class AuthenticationDetails {
  constructor(readonly method: AuthenticationMethod, readonly identifier: AuthenticationIdentifier) {}
}
