import database from '../../../database';
import { testTypeRepository } from '../../../infrastructure/persistence';
import { GetTestTypes } from './GetTestTypes';
import { TestType } from '../../../domain/model/test/testType/TestType';
import { TestTypeId } from '../../../domain/model/test/testType/TestTypeId';
import { cleanupDatabase } from '../../../test/cleanupDatabase';

describe('GetTestTypes', () => {
  const getTestTypes = new GetTestTypes(testTypeRepository);

  beforeEach(async () => {
    await cleanupDatabase();

    const id1 = new TestTypeId();
    const id2 = new TestTypeId();

    await testTypeRepository.save(new TestType(id1, 'trusted', { type: 'boolean' }, 'PERMISSION'));
    await testTypeRepository.save(new TestType(id2, 'untrusted', { type: 'boolean' }, 'PERMISSION'));
  });

  describe('forPermissions', () => {
    it('returns all test types for that permission', async () => {
      const testTypes = await getTestTypes.forPermissions(['PERMISSION']);
      expect(testTypes.length).toBe(2);
    });
  });
});

afterAll(() => {
  return database.destroy();
});
