import { AuthenticationProvider } from '../../../domain/model/idAuthentication/AuthenticationProvider';
import { GenerateAuthToken } from './GenerateAuthToken';
import { GetExistingOrCreateNewUser } from '../users/GetExistingOrCreateNewUser';
import { AuthenticationSessionToken } from '../../../domain/model/idAuthentication/models';
import { AuthenticationError } from '../../../domain/model/idAuthentication/AuthenticationError';

export class AuthenticateWithId {
  constructor(
    private authenticationProvider: AuthenticationProvider,
    private getExistingOrCreateNewUser: GetExistingOrCreateNewUser,
    private generateAuthToken: GenerateAuthToken
  ) {}

  public async execute(givenToken: string) {
    const sessionToken = new AuthenticationSessionToken(givenToken);

    let authentication;
    try {
      authentication = await this.authenticationProvider.authenticate(sessionToken);
    } catch (error) {
      throw new AuthenticationError(error.message);
    }

    const user = await this.getExistingOrCreateNewUser.execute(magicLink.email.value);
    const token = this.generateAuthToken.execute(user);

    return token;
  }
}
