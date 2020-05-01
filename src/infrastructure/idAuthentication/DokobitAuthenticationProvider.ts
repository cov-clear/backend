import * as config from '../../config';
import { AuthenticationProvider } from '../../domain/model/idAuthentication/AuthenticationProvider';
import { AuthenticationError } from '../../application/service/authentication/AuthenticationError';
import {
  AuthenticationSession,
  AuthenticationSessionToken,
  Authentication,
} from '../../domain/model/idAuthentication/models';
import { DokobitClient } from './DokobitClient';

const ESTONIA_CODE = 'et';

export class DokobitAuthenticationProvider implements AuthenticationProvider {
  constructor(private client = new DokobitClient()) {}

  async createSession(): Promise<AuthenticationSession> {
    const returnUrl = `${config.get('frontend.baseUrl')}/authenticate`;

    let session;
    try {
      session = await this.client.createSession({
        returnUrl,
      });
    } catch (error) {
      throw new AuthenticationError(error.message);
    }

    return {
      token: new AuthenticationSessionToken(session.sessionToken),
      redirectUrl: session.url,
    };
  }

  async authenticate(token: AuthenticationSessionToken): Promise<Authentication> {
    let sessionStatus;
    try {
      sessionStatus = await this.client.getSessionStatus(token.value);
    } catch (error) {
      throw new AuthenticationError(error.message);
    }

    if (sessionStatus.countryCode !== ESTONIA_CODE) {
      throw new AuthenticationError(`Country not supported: ${sessionStatus.countryCode}`);
    }

    return {
      code: sessionStatus.code,
      firstName: sessionStatus.name,
      lastName: sessionStatus.surname,
    };
  }
}
