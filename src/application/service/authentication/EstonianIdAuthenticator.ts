import { AuthenticationProvider } from '../../../domain/model/idAuthentication/AuthenticationProvider';
import { GenerateAuthToken } from './GenerateAuthToken';
import { GetExistingOrCreateNewUser } from '../users/GetExistingOrCreateNewUser';
import { AuthenticationResult, AuthenticationSessionToken } from '../../../domain/model/idAuthentication/models';
import { AuthCode, Authenticator } from '../../../domain/model/authentication/Authenticator';
import { AuthenticationDetails } from '../../../domain/model/user/AuthenticationDetails';
import { AuthenticationMethod, AuthenticationMethodType } from '../../../domain/model/user/AuthenticationMethod';
import { AuthenticationIdentifier } from '../../../domain/model/user/AuthenticationIdentifier';
import { AuthenticationError } from './AuthenticationError';
import { UserRepository } from '../../../domain/model/user/UserRepository';
import { User } from '../../../domain/model/user/User';

export class EstonianIdAuthenticator implements Authenticator {
  public handles = AuthenticationMethodType.ESTONIAN_ID;

  constructor(
    private authenticationProvider: AuthenticationProvider,
    private getExistingOrCreateNewUser: GetExistingOrCreateNewUser,
    private generateAuthToken: GenerateAuthToken,
    private userRepository: UserRepository
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
    await this.updateUserProfile(user, authenticationResult);

    return this.generateAuthToken.execute(user);
  }

  private async updateUserProfile(user: User, authenticationResult: AuthenticationResult) {
    user.profile = authenticationResult.profile;
    await this.userRepository.save(user);
  }
}
