import database from '../../database';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { permissionRepository, roleRepository } from '../../infrastructure/persistence';
import { ADMIN } from '../../domain/model/authentication/Roles';
import { ASSIGN_PERMISSION_TO_ROLE, ASSIGN_ROLE_TO_USER } from '../../domain/model/authentication/Permissions';
import { AccessDeniedError } from '../../domain/model/AccessDeniedError';
import { persistedUserWithRoleAndPermissions } from '../../test/persistedEntities';
import { AssignPermissionToRole } from './AssignPermissionToRole';
import { PermissionNotFoundError } from '../../domain/model/authentication/PermissionNotFoundError';
import { RoleNotFoundError } from '../../domain/model/authentication/RoleRepository';
import { Permission } from '../../domain/model/authentication/Permission';

describe('AssignPermissionToRole', () => {
  const assignPermissionToRole = new AssignPermissionToRole(roleRepository, permissionRepository);

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('throws error if given role is not found', async () => {
    const authenticatedUser = await persistedUserWithRoleAndPermissions(ADMIN, [ASSIGN_PERMISSION_TO_ROLE]);

    await expect(
      assignPermissionToRole.execute(ASSIGN_PERMISSION_TO_ROLE, 'NON_EXISTING_ROLE_NAME', authenticatedUser)
    ).rejects.toEqual(new RoleNotFoundError('NON_EXISTING_ROLE_NAME'));
  });

  it('throws error if the permission is not found', async () => {
    const authenticatedUser = await persistedUserWithRoleAndPermissions(ADMIN, [ASSIGN_PERMISSION_TO_ROLE]);

    await expect(assignPermissionToRole.execute('NON_EXISTING_PERMISSION', ADMIN, authenticatedUser)).rejects.toEqual(
      new PermissionNotFoundError('NON_EXISTING_PERMISSION')
    );
  });

  it('throws error if the authenticated user does not have the necessary permission', async () => {
    const authenticatedUser = await persistedUserWithRoleAndPermissions(ADMIN, [ASSIGN_ROLE_TO_USER]);
    const permission = await permissionRepository.save(new Permission('NEW_PERMISSION_NAME'));

    await expect(assignPermissionToRole.execute(permission.name, ADMIN, authenticatedUser)).rejects.toEqual(
      new AccessDeniedError(ASSIGN_PERMISSION_TO_ROLE)
    );
  });

  it('works if the authenticatedUser has the right permission', async () => {
    const authenticatedUser = await persistedUserWithRoleAndPermissions(ADMIN, [ASSIGN_PERMISSION_TO_ROLE]);
    const permission = await permissionRepository.save(new Permission('NEW_PERMISSION_NAME'));

    await assignPermissionToRole.execute(permission.name, ADMIN, authenticatedUser);

    const persistedRole = await roleRepository.findByName(ADMIN);
    expect(persistedRole?.permissions().map((permission) => permission.name)).toContain(permission.name);
  });
});

afterAll(() => {
  return database.destroy();
});
