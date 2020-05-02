import { AuthenticatorFactory } from './AuthenticatorFactory';
import { AuthenticationMethodType } from '../user/AuthenticationMethod';

describe(AuthenticatorFactory, () => {
  it('returns authenticator for method', () => {
    const magicLinkAuthenticator = {
      authenticate: jest.fn(),
      handles: AuthenticationMethodType.MAGIC_LINK,
    };
    const estonianIdAuthenticator = {
      authenticate: jest.fn(),
      handles: AuthenticationMethodType.ESTONIAN_ID,
    };

    const factory = new AuthenticatorFactory([magicLinkAuthenticator, estonianIdAuthenticator]);

    expect(factory.authenticatorFor(AuthenticationMethodType.MAGIC_LINK)).toBe(magicLinkAuthenticator);
    expect(factory.authenticatorFor(AuthenticationMethodType.ESTONIAN_ID)).toBe(estonianIdAuthenticator);
  });

  it('throws if not provided all authentication method implementations', () => {
    const magicLinkAuthenticator = {
      authenticate: jest.fn(),
      handles: AuthenticationMethodType.MAGIC_LINK,
    };

    expect(() => new AuthenticatorFactory([magicLinkAuthenticator])).toThrow(/unimplemented/i);
  });
});
