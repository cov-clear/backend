import { AuthenticationDetails } from './AuthenticationDetails';
import { AuthenticationMethod, AuthenticationMethodType } from './AuthenticationMethod';
import { AuthenticationIdentifier } from './AuthenticationIdentifier';

describe(AuthenticationDetails, () => {
  it('cannot be created for unsupported authentication methods', () => {
    const method = AuthenticationMethod.magicLink();
    overrideSupported(method, false);

    expect(() => {
      new AuthenticationDetails(method, new AuthenticationIdentifier('any'));
    }).toThrow(/method not supported/);
  });

  it('can be created for supported authentication methods', () => {
    const method = AuthenticationMethod.magicLink();
    overrideSupported(method, true);

    const details = new AuthenticationDetails(method, new AuthenticationIdentifier('any'));
    expect(details.method.type).toBe(AuthenticationMethodType.MAGIC_LINK);
  });
});

function overrideSupported(method: AuthenticationMethod, value: boolean) {
  Object.defineProperty(method, 'supported', {
    value,
  });
}
