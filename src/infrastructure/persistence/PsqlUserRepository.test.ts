import database from '../../database';
import { PsqlUserRepository } from './PsqlUserRepository';
import { UserId } from '../../domain/model/user/UserId';
import { User } from '../../domain/model/user/User';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import {
  anAddress,
  aNewUser,
  aPermission,
  aProfile,
  aRoleWithPermissions,
  magicLinkAuthenticationDetails,
} from '../../test/domainFactories';
import { Role } from '../../domain/model/authentication/Role';
import { permissionRepository, roleRepository } from './index';
import { Permission } from '../../domain/model/authentication/Permission';
import { AuthenticationDetails } from '../../domain/model/user/AuthenticationDetails';
import { AuthenticationMethod } from '../../domain/model/user/AuthenticationMethod';
import { AuthenticationValue } from '../../domain/model/user/AuthenticationValue';

describe('PsqlUserRepository', () => {
  const psqlUserRepository = new PsqlUserRepository(database);

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('inserts new and retrieves a user by id', async () => {
    const user = await psqlUserRepository.save(User.create(magicLinkAuthenticationDetails('kostas1@example.com')));

    const persistedUser = await psqlUserRepository.findByUserId(user.id);

    expect(persistedUser?.id).toEqual(user.id);
    expect(persistedUser?.email).toEqual(user.email);
    expect(persistedUser?.authenticationDetails.value.value).toBe('kostas1@example.com');
    expect(persistedUser?.authenticationDetails.method).toBe(AuthenticationMethod.MAGIC_LINK);
    expect(persistedUser?.profile).toEqual(user.profile);
    expect(persistedUser?.address).toEqual(user.address);
    expect(persistedUser?.creationTime).toEqual(user.creationTime);
    expect(persistedUser?.modificationTime).toEqual(user.modificationTime);
  });

  it('inserts new and retrieves a user by email', async () => {
    const user = await psqlUserRepository.save(User.create(magicLinkAuthenticationDetails('kostas2@example.com')));

    const persistedUser = await psqlUserRepository.findByAuthenticationDetails(
      magicLinkAuthenticationDetails('kostas2@example.com')
    );

    expect(persistedUser?.id).toEqual(user.id);
  });

  it('inserts new and retrieves a user by estonian id', async () => {
    const user = await psqlUserRepository.save(
      User.create(new AuthenticationDetails(AuthenticationMethod.ESTONIAN_ID, new AuthenticationValue('32123')))
    );

    const persistedUser = await psqlUserRepository.findByAuthenticationDetails(
      new AuthenticationDetails(AuthenticationMethod.ESTONIAN_ID, new AuthenticationValue('32123'))
    );

    expect(persistedUser?.id).toEqual(user.id);
  });

  it('updates profile if user already exists', async () => {
    const user = await psqlUserRepository.save(User.create(magicLinkAuthenticationDetails()));

    user.profile = aProfile();
    await psqlUserRepository.save(user);

    const persistedUser = await psqlUserRepository.findByUserId(user.id);
    expect(persistedUser?.profile).toEqual(user.profile);
  });

  it('updates address if user already exists', async () => {
    const user = await psqlUserRepository.save(User.create(magicLinkAuthenticationDetails()));

    user.address = anAddress();
    await psqlUserRepository.save(user);

    const persistedUser = await psqlUserRepository.findByUserId(user.id);
    expect(persistedUser?.address).toEqual(user.address);
  });

  it('persists all the role assignments', async () => {
    const permission = await permissionRepository.save(aPermission('ADD_PCR_RESULT'));
    const role = await roleRepository.save(aRoleWithPermissions('DOCTOR', [permission]));

    const user = await psqlUserRepository.save(aNewUser());
    user.assignRole(role, user.id);
    await psqlUserRepository.save(user);

    const persistedUser = await psqlUserRepository.findByUserId(user.id);
    expect(persistedUser?.roles).toEqual([role.name]);
    expect(persistedUser?.permissions).toEqual([permission.name]);
  });

  it('correctly handles many consecutive role assignments', async () => {
    const user = await psqlUserRepository.save(aNewUser());

    const permission1 = await permissionRepository.save(new Permission('PERMISSION_ONE'));
    const permission2 = await permissionRepository.save(new Permission('PERMISSION_TWO'));
    const permission3 = await permissionRepository.save(new Permission('PERMISSION_THREE'));

    const role1 = new Role('USER');
    const role2 = new Role('DOCTOR');

    role1.assignPermission(permission1, user.id);
    role1.assignPermission(permission2, user.id);
    role2.assignPermission(permission2, user.id);
    role2.assignPermission(permission3, user.id);

    await roleRepository.save(role1);
    await roleRepository.save(role2);

    user.assignRole(role1, new UserId());
    user.assignRole(role2, new UserId());
    user.removeRole(role1, new UserId());
    await psqlUserRepository.save(user);

    let persistedUser = await psqlUserRepository.findByUserId(user.id);
    expect(persistedUser?.roles).toEqual([role2.name]);

    user.assignRole(role1, new UserId());
    user.removeRole(role2, new UserId());
    await psqlUserRepository.save(user);

    persistedUser = await psqlUserRepository.findByUserId(user.id);
    expect(persistedUser?.roles).toEqual([role1.name]);

    user.assignRole(role2, new UserId());
    await psqlUserRepository.save(user);

    persistedUser = await psqlUserRepository.findByUserId(user.id);
    expect(persistedUser?.roles.length).toEqual(2);
    expect(persistedUser?.roles).toContain(role1.name);
    expect(persistedUser?.roles).toContain(role2.name);
  });
});

afterAll(() => {
  return database.destroy();
});
