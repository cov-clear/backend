import * as config from '../../config';
import { AuthenticationProvider } from '../../domain/model/idAuthentication/AuthenticationProvider';
import { AuthenticationError } from '../../application/service/authentication/AuthenticationError';
import {
  AuthenticationSession,
  AuthenticationSessionToken,
  AuthenticationResult,
} from '../../domain/model/idAuthentication/models';
import { DokobitClient, DokobitSessionStatus } from './DokobitClient';
import { Profile } from '../../domain/model/user/Profile';
import Isikukood from 'isikukood';
import { DateOfBirth } from '../../domain/model/user/DateOfBirth';
import { Sex } from '../../domain/model/user/Sex';

const ESTONIA_CODE = 'ee';

export class DokobitAuthenticationProvider implements AuthenticationProvider {
  constructor(private client = new DokobitClient()) {}

  async createSession(): Promise<AuthenticationSession> {
    const returnUrl = `${config.get('frontend.baseUrl')}/authentication-callback?method=ESTONIAN_ID`;

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

  async authenticate(token: AuthenticationSessionToken): Promise<AuthenticationResult> {
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
      profile: mapToProfile(sessionStatus),
    };
  }
}

function mapToProfile(sessionStatus: DokobitSessionStatus): Profile {
  var id = getAndValidateEstonianIdCode(sessionStatus);
  id.validate();
  return new Profile(sessionStatus.name, sessionStatus.surname, DateOfBirth.fromDate(id.getBirthday()), getSex(id));
}

function getAndValidateEstonianIdCode(sessionStatus: DokobitSessionStatus): Isikukood {
  const idCode = new Isikukood(sessionStatus.code);
  if (!idCode.validate()) {
    throw new AuthenticationError('idCode is not valid');
  }
  return idCode;
}

function getSex(id: Isikukood): Sex {
  const gender = id.getGender();
  if (gender === 'unknown') {
    throw new AuthenticationError('Non parsable gender');
  }
  return gender === 'male' ? Sex.MALE : Sex.FEMALE;
}
