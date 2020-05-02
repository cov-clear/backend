import { AuthenticationProvider } from '../../../domain/model/idAuthentication/AuthenticationProvider';
import { GenerateAuthToken } from './GenerateAuthToken';
import { GetExistingOrCreateNewUser } from '../users/GetExistingOrCreateNewUser';
import { AuthenticationSessionToken, AuthenticationResult } from '../../../domain/model/idAuthentication/models';
import { Authenticator, AuthCode } from '../../../domain/model/authentication/Authenticator';
import { AuthenticationDetails } from '../../../domain/model/user/AuthenticationDetails';
import { AuthenticationMethodType, AuthenticationMethod } from '../../../domain/model/user/AuthenticationMethod';
import { AuthenticationIdentifier } from '../../../domain/model/user/AuthenticationIdentifier';
import { AuthenticationError } from './AuthenticationError';

export class EstonianIdAuthenticator implements Authenticator {
  public handles = AuthenticationMethodType.ESTONIAN_ID;

  constructor(
    private authenticationProvider: AuthenticationProvider,
    private getExistingOrCreateNewUser: GetExistingOrCreateNewUser,
    private generateAuthToken: GenerateAuthToken
  ) {}

  async authenticate(authCode: AuthCode): Promise<string> {
    const sessionToken = new AuthenticationSessionToken(authCode);

    let authenticationResult: AuthenticationResult;
    try {
      authenticationResult = await this.authenticationProvider.authenticate(sessionToken);
    } catch (error) {
      throw new AuthenticationError('ID_AUTH_INVALID', error.message);
    }

    const identifier = new AuthenticationIdentifier(authenticationResult.code);
    const authenticationDetails = new AuthenticationDetails(AuthenticationMethod.estonianId(), identifier);

    const user = await this.getExistingOrCreateNewUser.execute(authenticationDetails);
    // TODO: fill profile from `authentication`
    const token = this.generateAuthToken.execute(user);

    return token;
  }
}
