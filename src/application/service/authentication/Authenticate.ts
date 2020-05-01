import { LoginCommand } from '../../../presentation/commands/authentication/LoginCommand';
import { AuthenticationMethod } from '../../../domain/model/user/AuthenticationMethod';
import { AuthenticatorFactory } from '../../../domain/model/authentication/AuthenticatorFactory';
import { AuthenticationIdentifier } from '../../../domain/model/user/AuthenticationIdentifier';

export class Authenticate {
  constructor(private authenticatorFactory: AuthenticatorFactory) {}

  public async execute({ method, identifier }: LoginCommand) {
    let authenticationMethod;
    try {
      authenticationMethod = AuthenticationMethod.fromString(method);
    } catch (e) {
      throw new AuthenticationFailedError(AuthenticationFailureReason.INVALID_METHOD);
    }

    const authenticator = this.authenticatorFactory.authenticatorFor(authenticationMethod);
    const authenticationIdentifier = new AuthenticationIdentifier(identifier);
    const token = await authenticator.authenticate(authenticationIdentifier);

    return token;
  }
}

export class AuthenticationFailedError extends Error {
  constructor(public failureReason: AuthenticationFailureReason) {
    super(`Failed to authenticate code due to ${failureReason}`);
  }
}

export enum AuthenticationFailureReason {
  INVALID_METHOD = 'INVALID_METHOD',
}
