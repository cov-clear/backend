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
});

afterAll(() => {
  return database.destroy();
});
