import { Authenticator } from './Authenticator';
import { AuthenticationMethodType } from '../user/AuthenticationMethod';
import { InvalidDomainStateError } from '../InvalidDomainStateError';

export class AuthenticatorFactory {
  private authenticators: Map<AuthenticationMethodType, Authenticator>;

  constructor(authenticators: Authenticator[]) {
    this.authenticators = new Map(authenticators.map((authenticator) => [authenticator.handles, authenticator]));
    this.checkAllAuthenticationMethodsImplemented();
  }

  public authenticatorFor(method: AuthenticationMethodType): Authenticator {
    return this.authenticators.get(method)!;
  }

  private checkAllAuthenticationMethodsImplemented(): void {
    Object.values(AuthenticationMethodType).forEach((method) => {
      if (!this.authenticators.has(method)) {
        throw new InvalidDomainStateError(`Unimplemented authenticator for method: ${method}`);
      }
    });
  }
}
