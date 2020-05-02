import { EstonianIdAuthenticator } from './EstonianIdAuthenticator';
import { GetExistingOrCreateNewUser } from '../users/GetExistingOrCreateNewUser';
import { GenerateAuthToken } from './GenerateAuthToken';
import { AuthenticationError } from './AuthenticationError';

describe(EstonianIdAuthenticator, () => {
  it('throws an AuthenticationError when the id authentication provider fails', async () => {
    const authenticationProvider = {
      authenticate: jest.fn(() => {
        throw new Error('invalid token');
      }),
      createSession: jest.fn(),
    };
    const getExistingOrCreateNewUser = ({ execute: jest.fn() } as unknown) as GetExistingOrCreateNewUser;
    const generateAuthToken = ({ execute: jest.fn() } as unknown) as GenerateAuthToken;
    const authenticator = new EstonianIdAuthenticator(
      authenticationProvider,
      getExistingOrCreateNewUser,
      generateAuthToken
    );

    await expect(authenticator.authenticate('some-dokobit-token')).rejects.toThrow(AuthenticationError);
  });
});
