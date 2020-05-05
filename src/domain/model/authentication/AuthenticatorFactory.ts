import { Authenticator } from './Authenticator';
import { AuthenticationMethodType } from '../user/AuthenticationMethod';
import { InvalidDomainStateError } from '../InvalidDomainStateError';

export class AuthenticatorFactory {
  private authenticators: Map<AuthenticationMethodType, Authenticator>;

  constructor(authenticators: Authenticator[]) {
    this.authenticators = new Map(authenticators.map((authenticator) => [authenticator.handles, authenticator]));
  }

  public authenticatorFor(method: AuthenticationMethodType): Authenticator {
    return this.authenticators.get(method)!;
  }
}
