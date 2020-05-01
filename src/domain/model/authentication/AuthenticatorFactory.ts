import { Authenticator } from './Authenticator';
import { AuthenticationMethod } from '../user/AuthenticationMethod';
import { InvalidDomainStateError } from '../InvalidDomainStateError';

export class AuthenticatorFactory {
  private authenticators: Map<AuthenticationMethod, Authenticator>;

  constructor(authenticators: Authenticator[]) {
    this.authenticators = new Map(authenticators.map((authenticator) => [authenticator.handles, authenticator]));
    this.checkAllAuthenticationMethodsImplemented();
  }

  public authenticatorFor(method: AuthenticationMethod): Authenticator {
    return this.authenticators.get(method)!;
  }

  private checkAllAuthenticationMethodsImplemented(): void {
    Object.values(AuthenticationMethod).forEach((method) => {
      if (!this.authenticators.has(method)) {
        throw new InvalidDomainStateError(`Unimplemented authenticator for method: ${method}`);
      }
    });
  }
}
