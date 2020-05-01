import { AuthenticationProvider } from '../../../domain/model/idAuthentication/AuthenticationProvider';
import { GenerateAuthToken } from './GenerateAuthToken';
import { GetExistingOrCreateNewUser } from '../users/GetExistingOrCreateNewUser';
import { AuthenticationSessionToken, Authentication } from '../../../domain/model/idAuthentication/models';
import { AuthenticationError } from '../../../domain/model/idAuthentication/AuthenticationError';
import { Authenticator, AuthCode } from '../../../domain/model/authentication/Authenticator';
import { AuthenticationDetails } from '../../../domain/model/user/AuthenticationDetails';
import { AuthenticationMethod } from '../../../domain/model/user/AuthenticationMethod';
import { AuthenticationIdentifier } from '../../../domain/model/user/AuthenticationIdentifier';

export class EstonianIdAuthenticator implements Authenticator {
  public handles: AuthenticationMethod.ESTONIAN_ID;

  constructor(
    private authenticationProvider: AuthenticationProvider,
    private getExistingOrCreateNewUser: GetExistingOrCreateNewUser,
    private generateAuthToken: GenerateAuthToken
  ) {}

  async authenticate(authCode: AuthCode): Promise<string> {
    const sessionToken = new AuthenticationSessionToken(authCode);

    let authentication: Authentication;
    try {
      authentication = await this.authenticationProvider.authenticate(sessionToken);
    } catch (error) {
      throw new AuthenticationError(error.message);
    }

    const identifier = new AuthenticationIdentifier(authentication.code);
    const authenticationDetails = new AuthenticationDetails(AuthenticationMethod.ESTONIAN_ID, identifier);

    const user = await this.getExistingOrCreateNewUser.execute(authenticationDetails);
    // TODO: fill profile from `authentication`
    const token = this.generateAuthToken.execute(user);

    return token;
  }
}
