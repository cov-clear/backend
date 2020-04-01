import database from '../../database';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { permissionRepository, userRepository } from '../../infrastructure/persistence';
import { aNewUser } from '../../test/domainFactories';
import { AccessDeniedError } from '../../domain/model/AccessDeniedError';
import { CREATE_NEW_PERMISSION, CREATE_NEW_ROLE } from '../../domain/model/authentication/Permissions';
import { persistedUserWithRoleAndPermissions } from '../../test/persistedEntities';
import { ADMIN } from '../../domain/model/authentication/Roles';
import { CreatePermission } from './CreatePermission';

describe('CreatePermission', () => {
  const createPermission = new CreatePermission(permissionRepository);

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('throws error if the authenticated user does not have permission to create new permissions', async () => {
    const user = await userRepository.save(aNewUser());

    await expect(createPermission.execute('NON_EXISTING_PERMISSION_NAME', user)).rejects.toEqual(
      new AccessDeniedError(CREATE_NEW_PERMISSION)
    );
  });

  it('creates new permission if the authenticated user has the right permission', async () => {
    const user = await persistedUserWithRoleAndPermissions(ADMIN, [CREATE_NEW_PERMISSION]);
    const newPermissionName = 'NON_EXISTING_PERMISSION_NAME';

    await createPermission.execute(newPermissionName, user);

    const persistedPermission = await permissionRepository.findByName(newPermissionName);
    expect(persistedPermission?.name).toEqual(newPermissionName);
  });
});

afterAll(() => {
  return database.destroy();
});
