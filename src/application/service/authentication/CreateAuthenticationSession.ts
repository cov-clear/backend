import { AuthenticationProvider } from '../../../domain/model/idAuthentication/AuthenticationProvider';
import { AuthenticationSession } from '../../../domain/model/idAuthentication/models';

export class CreateAuthenticationSession {
  constructor(private authenticationProvider: AuthenticationProvider) {}

  public execute(): Promise<AuthenticationSession> {
    return this.authenticationProvider.createSession();
  }
}
