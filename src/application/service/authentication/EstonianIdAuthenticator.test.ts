import { EstonianIdAuthenticator } from './EstonianIdAuthenticator';
import { AuthenticationError } from './AuthenticationError';
import { userRepository } from '../../../infrastructure/persistence';
import { aProfile } from '../../../test/domainFactories';
import { AuthenticationDetails } from '../../../domain/model/user/AuthenticationDetails';
import { AuthenticationMethod } from '../../../domain/model/user/AuthenticationMethod';
import { AuthenticationIdentifier } from '../../../domain/model/user/AuthenticationIdentifier';
import { generateAuthToken, getExistingOrCreateNewUser } from '../index';
import database from '../../../database';

describe(EstonianIdAuthenticator, () => {
  it('throws an AuthenticationError when the id authentication provider fails', async () => {
    const authenticationProvider = {
      authenticate: jest.fn(() => {
        throw new Error('invalid token');
      }),
      createSession: jest.fn(),
    };
    const authenticator = new EstonianIdAuthenticator(
      authenticationProvider,
      getExistingOrCreateNewUser,
      generateAuthToken,
      userRepository
    );

    await expect(authenticator.authenticate('some-dokobit-token')).rejects.toThrow(AuthenticationError);
  });

  it('creates a user and fills the profile information', async () => {
    const profile = aProfile();
    const code = '120938120';

    const authenticationProvider = {
      authenticate: jest.fn(() => {
        return Promise.resolve({ code, profile });
      }),
      createSession: jest.fn(),
    };

    const authenticator = new EstonianIdAuthenticator(
      authenticationProvider,
      getExistingOrCreateNewUser,
      generateAuthToken,
      userRepository
    );

    const token = await authenticator.authenticate('some-dokobit-token');
    expect(token).toBeDefined();

    const user = await userRepository.findByAuthenticationDetails(
      new AuthenticationDetails(AuthenticationMethod.estonianId(), new AuthenticationIdentifier('120938120'))
    );

    expect(user).toBeDefined();
    expect(user?.profile).toEqual(profile);
  });
});

afterAll(() => {
  return database.destroy();
});
