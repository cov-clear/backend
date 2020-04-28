import { AuthenticationMethod } from './AuthenticationMethod';
import { AuthenticationValue } from './AuthenticationValue';

export class AuthenticationDetails {
  constructor(readonly method: AuthenticationMethod, readonly value: AuthenticationValue) {}
}
