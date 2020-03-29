import database from '../../database';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { PsqlRoleRepository } from './PsqlRoleRepository';
import { Role } from '../../domain/model/authentication/Role';
import { Permission } from '../../domain/model/authentication/Permission';
import { UserId } from '../../domain/model/user/UserId';
import { permissionRepository } from './index';

describe('PsqlRoleRepository', () => {
  const psqlRoleRepository = new PsqlRoleRepository(database);

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('inserts new and retrieves a role', async () => {
    const role = new Role('DOCTOR');

    await expect(psqlRoleRepository.findByName(role.name)).resolves.toBeNull();

    await psqlRoleRepository.save(role);

    const persistedRole = await psqlRoleRepository.findByName(role.name);
    expect(persistedRole?.name).toEqual(role.name);
    expect(persistedRole?.permissions()).toEqual([]);
    expect(persistedRole?.creationTime).toEqual(role.creationTime);
  });

  it('persists all the permission assignments', async () => {
    const role = new Role('DOCTOR');
    const permission = await permissionRepository.save(
      new Permission('ADD_PCR_TEST')
    );

    await expect(psqlRoleRepository.findByName(role.name)).resolves.toBeNull();
    await psqlRoleRepository.save(role);

    role.assignPermission(permission, new UserId());
    await psqlRoleRepository.save(role);

    const persistedRole = await psqlRoleRepository.findByName(role.name);
    expect(persistedRole?.permissions()).toEqual([permission]);
  });

  it('correctly handles many consecutive permission assignments', async () => {
    const role = new Role('DOCTOR');
    const permission1 = await permissionRepository.save(
      new Permission('ADD_PCR_TEST')
    );
    const permission2 = await permissionRepository.save(
      new Permission('ADD_TAKE_HOME_TEST')
    );
    role.assignPermission(permission1, new UserId());
    role.assignPermission(permission2, new UserId());
    role.removePermission(permission1, new UserId());
    expect(role.permissions()).toEqual([permission2]);

    await psqlRoleRepository.save(role);
    role.assignPermission(permission1, new UserId());
    role.removePermission(permission2, new UserId());
    expect(role?.permissions()).toEqual([permission1]);
    await psqlRoleRepository.save(role);

    role.assignPermission(permission2, new UserId());
    await psqlRoleRepository.save(role);

    const persistedRole = await psqlRoleRepository.findByName(role.name);
    expect(persistedRole?.permissions()).toEqual([permission1, permission2]);
  });
});

afterAll(() => {
  return database.destroy();
});
