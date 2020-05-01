import { Authenticate } from './Authenticate';
import { AuthenticationMethod } from '../../../domain/model/user/AuthenticationMethod';
import { AuthenticatorFactory } from '../../../domain/model/authentication/AuthenticatorFactory';

describe(Authenticate, () => {
  it('throws an AuthenticationFailedError when an invalid authentication method is provided', async () => {
    const authenticate = new Authenticate(({
      authenticatorFor: () => ({
        handles: AuthenticationMethod.ESTONIAN_ID,
        authenticate: jest.fn(),
      }),
    } as unknown) as AuthenticatorFactory);

    await expect(authenticate.execute({ method: 'MISSING_METHOD', authCode: 'some-auth-code' } as any)).rejects.toThrow(
      /INVALID_METHOD/
    );
  });
});
