import { LoginCommand } from '../../../presentation/commands/authentication/LoginCommand';
import { fromString } from '../../../domain/model/user/AuthenticationMethod';
import { AuthenticatorFactory } from '../../../domain/model/authentication/AuthenticatorFactory';
import { AuthenticationError } from './AuthenticationError';

export class Authenticate {
  constructor(private authenticatorFactory: AuthenticatorFactory) {}

  public async execute({ method, authCode }: LoginCommand) {
    let authenticationMethod;
    try {
      authenticationMethod = fromString(method);
    } catch (e) {
      throw new AuthenticationError('INVALID_METHOD');
    }

    const authenticator = this.authenticatorFactory.authenticatorFor(authenticationMethod);
    const token = await authenticator.authenticate(authCode);

    return token;
  }
}
