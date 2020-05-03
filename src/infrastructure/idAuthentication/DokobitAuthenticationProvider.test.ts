import { DokobitAuthenticationProvider } from './DokobitAuthenticationProvider';
import { DokobitClient } from './DokobitClient';
import { AuthenticationError } from '../../application/service/authentication/AuthenticationError';
import { AuthenticationSessionToken } from '../../domain/model/idAuthentication/models';
import { DateOfBirth } from '../../domain/model/user/DateOfBirth';
import { Sex } from '../../domain/model/user/Sex';

describe('Dokobit authentication provider', () => {
  it('creates sessions', async () => {
    const provider = new DokobitAuthenticationProvider({
      async createSession({ returnUrl }) {
        if (returnUrl === 'http://localhost:3000/authentication-callback?method=ESTONIAN_ID') {
          return {
            sessionToken: 'seshToken',
            url: 'https://example.com/dokobit-redirect',
          };
        }
      },
    } as DokobitClient);

    const response = await provider.createSession();

    expect(response.token.value).toBe('seshToken');
    expect(response.redirectUrl).toBe('https://example.com/dokobit-redirect');
  });

  it('does not let non-estonians authenticate', async () => {
    const provider = new DokobitAuthenticationProvider({
      async getSessionStatus(sessionToken) {
        if (sessionToken === 'seshToken') {
          return {
            code: '',
            name: '',
            surname: '',
            countryCode: 'lt',
          };
        }
      },
    } as DokobitClient);

    await expect(provider.authenticate(new AuthenticationSessionToken('seshToken'))).rejects.toThrow(
      AuthenticationError
    );
  });

  it('authenticates', async () => {
    const provider = new DokobitAuthenticationProvider({
      async getSessionStatus(sessionToken) {
        if (sessionToken === 'seshToken') {
          return {
            code: '39210030814',
            name: 'Indrek',
            surname: 'Nolan',
            countryCode: 'ee',
          };
        }
      },
    } as DokobitClient);

    const response = await provider.authenticate(new AuthenticationSessionToken('seshToken'));

    expect(response.code).toBe('39210030814');
    expect(response.profile.firstName).toBe('Indrek');
    expect(response.profile.lastName).toBe('Nolan');
    expect(response.profile.dateOfBirth.toString()).toEqual(new DateOfBirth(1992, 10, 3).toString());
    expect(response.profile.sex).toEqual(Sex.MALE);
  });
});
