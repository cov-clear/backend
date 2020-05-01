import { AuthenticatorFactory } from './AuthenticatorFactory';
import { AuthenticationMethod } from '../user/AuthenticationMethod';

describe(AuthenticatorFactory, () => {
  it('returns authenticator for method', () => {
    const magicLinkAuthenticator = {
      authenticate: jest.fn(),
      handles: AuthenticationMethod.MAGIC_LINK,
    };
    const estonianIdAuthenticator = {
      authenticate: jest.fn(),
      handles: AuthenticationMethod.ESTONIAN_ID,
    };

    const factory = new AuthenticatorFactory([magicLinkAuthenticator, estonianIdAuthenticator]);

    expect(factory.authenticatorFor(AuthenticationMethod.MAGIC_LINK)).toBe(magicLinkAuthenticator);
    expect(factory.authenticatorFor(AuthenticationMethod.ESTONIAN_ID)).toBe(estonianIdAuthenticator);
  });

  it('throws if not provided all authentication method implementations', () => {
    const magicLinkAuthenticator = {
      authenticate: jest.fn(),
      handles: AuthenticationMethod.MAGIC_LINK,
    };

    expect(() => new AuthenticatorFactory([magicLinkAuthenticator])).toThrow(/unimplemented/i);
  });
});
