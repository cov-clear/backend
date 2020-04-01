import database from '../../database';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { AssignRoleToUser } from './AssignRoleToUser';
import { roleRepository, userRepository } from '../../infrastructure/persistence';
import { aNewUser } from '../../test/domainFactories';
import { RoleNotFoundError } from '../../domain/model/authentication/RoleNotFoundError';
import { UserId } from '../../domain/model/user/UserId';
import { ADMIN, USER } from '../../domain/model/authentication/Roles';
import { Role } from '../../domain/model/authentication/Role';
import { UserNotFoundError } from '../../domain/model/user/UserNotFoundError';
import { ASSIGN_ROLE_TO_USER } from '../../domain/model/authentication/Permissions';
import { AccessDeniedError } from '../../domain/model/AccessDeniedError';
import { persistedUserWithRoleAndPermissions } from '../../test/persistedEntities';

describe('AssignRoleToUser', () => {
  const assignRoleToUser = new AssignRoleToUser(userRepository, roleRepository);

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('throws error if given role name is not persisted', async () => {
    const admin = await userRepository.save(aNewUser());
    const user = await userRepository.save(aNewUser());

    await expect(assignRoleToUser.execute('NON_EXISTING_ROLE_NAME', user.id.value, admin)).rejects.toEqual(
      new RoleNotFoundError('NON_EXISTING_ROLE_NAME')
    );
  });

  it('throws error if the userId is not found', async () => {
    const admin = await userRepository.save(aNewUser());
    const role = await roleRepository.save(new Role(USER));
    const userId = new UserId();

    await expect(assignRoleToUser.execute(role.name, userId.value, admin)).rejects.toEqual(
      new UserNotFoundError(userId)
    );
  });

  it('throws error if the authenticated user does not have the necessary permission', async () => {
    const user = await userRepository.save(aNewUser());
    const authenticatedUser = await userRepository.save(aNewUser());
    const role = await roleRepository.save(new Role(USER));

    await expect(assignRoleToUser.execute(role.name, user.id.value, authenticatedUser)).rejects.toEqual(
      new AccessDeniedError(ASSIGN_ROLE_TO_USER)
    );
  });

  it('works if the authenticatedUser has the right role', async () => {
    const user = await userRepository.save(aNewUser());
    const role = await roleRepository.save(new Role(USER));
    const admin = await persistedUserWithRoleAndPermissions(ADMIN, [ASSIGN_ROLE_TO_USER]);

    await assignRoleToUser.execute(role.name, user.id.value, admin);

    const persistedUser = await userRepository.findByUserId(user.id);
    expect(persistedUser?.roles).toEqual([USER]);
  });
});

afterAll(() => {
  return database.destroy();
});
