import { GenerateAuthToken } from './GenerateAuthToken';
import { GetExistingOrCreateNewUser } from '../users/GetExistingOrCreateNewUser';
import { LoginCommand } from '../../../presentation/commands/authentication/LoginCommand';
import { AuthenticateWithId } from './AuthenticateWithId';
import { ExchangeAuthCode } from './ExchangeAuthCode';

export class Authenticate {
  constructor(private exchangeAuthCode: ExchangeAuthCode, private authenticateWithId: AuthenticateWithId) {}

  public async execute({ method, value }: LoginCommand) {
    switch (method) {
      case 'MAGIC_LINK':
        return this.exchangeAuthCode.execute(value);
      case 'ID_CODE':
        return this.authenticateWithId.execute(value);
      default:
        throw new AuthorisationFailedError(AuthorisationFailureReason.INVALID_METHOD);
    }
  }
}

export class AuthorisationFailedError extends Error {
  constructor(public failureReason: AuthorisationFailureReason) {
    super(`Failed to authorise code due to ${failureReason}`);
  }
}

// FIXME: Where should that live? Is it a generic authentication error?
export enum AuthorisationFailureReason {
  INVALID_METHOD = 'INVALID_METHOD',
}
