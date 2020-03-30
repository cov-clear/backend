import database from '../../database';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { Permission } from '../../domain/model/authentication/Permission';
import { PsqlPermissionRepository } from './PsqlPermissionRepository';

describe('PsqlPermissionRepository', () => {
  const psqlPermissionRepository = new PsqlPermissionRepository(database);

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('inserts new and retrieves a permission', async () => {
    const permission = new Permission('ADD_PCR_TEST');

    await expect(
      psqlPermissionRepository.findByName(permission.name)
    ).resolves.toBeNull();

    await psqlPermissionRepository.save(permission);

    await expect(
      psqlPermissionRepository.findByName(permission.name)
    ).resolves.toEqual(permission);
  });

  it('finds all the registered permissions', async () => {
    const initialPermissions = await psqlPermissionRepository.findAll();
    const permission1 = new Permission('PERMISSION_ONE');
    const permission2 = new Permission('PERMISSION_TWO');
    await psqlPermissionRepository.save(permission1);
    await psqlPermissionRepository.save(permission2);

    const permissions = await psqlPermissionRepository.findAll();
    await expect(permissions.length).toEqual(initialPermissions.length + 2);
  });
});

afterAll(() => {
  return database.destroy();
});
