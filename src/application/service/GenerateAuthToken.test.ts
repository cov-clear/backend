import { GenerateAuthToken } from './GenerateAuthToken';
import { aNewUser, aPermission, aRoleWithPermissions } from '../../test/domainFactories';
import jwt from 'jsonwebtoken';

describe('GenerateAuthToken', () => {
  const TTL_IN_HOURS = 10;
  const TOKEN_SECRET = 'secret';
  const generateAuthToken = new GenerateAuthToken(TOKEN_SECRET, TTL_IN_HOURS);

  it('generates a token with the correct user, roles, permissions and expiration', async () => {
    const user = aNewUser();
    const role = aRoleWithPermissions('USER', [aPermission()]);
    user.assignRole(role, user.id);

    const token = await generateAuthToken.execute(user);

    const decodedToken = jwt.verify(token, TOKEN_SECRET) as any;
    expect(decodedToken.userId).toEqual(user.id.value);
    expect(decodedToken.roles).toEqual(user.roles);
    expect(decodedToken.permissions).toEqual(user.permissions);
    expect(decodedToken.expiration).toBeDefined();
  });
});
