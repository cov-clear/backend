import database from '../../database';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { roleRepository, userRepository } from '../../infrastructure/persistence';
import { aNewUser } from '../../test/domainFactories';
import { CreateRole } from './CreateRole';
import { AccessDeniedError } from '../../domain/model/AccessDeniedError';
import { CREATE_NEW_ROLE } from '../../domain/model/authentication/Permissions';
import { persistedUserWithRoleAndPermissions } from '../../test/persistedEntities';
import { ADMIN } from '../../domain/model/authentication/Roles';

describe('CreateRole', () => {
  const createRole = new CreateRole(roleRepository);

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('throws error if the authenticated user does not have permission to create new roles', async () => {
    const user = await userRepository.save(aNewUser());

    await expect(createRole.execute('NON_EXISTING_ROLE_NAME', user)).rejects.toEqual(
      new AccessDeniedError(CREATE_NEW_ROLE)
    );
  });

  it('creates new role if the authenticated user has the right permission', async () => {
    const user = await persistedUserWithRoleAndPermissions(ADMIN, [CREATE_NEW_ROLE]);
    const newRoleName = 'NON_EXISTING_ROLE_NAME';

    await createRole.execute(newRoleName, user);

    const persistedRole = await roleRepository.findByName(newRoleName);
    expect(persistedRole?.name).toEqual(newRoleName);
  });
});

afterAll(() => {
  return database.destroy();
});
