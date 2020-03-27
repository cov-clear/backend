import { testTypeRepository } from '../../infrastructure/persistence';
import database from '../../database';
import { GetTestTypes } from './GetTestTypes';
import { TestType } from '../../domain/model/testType/TestType';
import { TestTypeId } from '../../domain/model/testType/TestTypeId';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { getTestTypes } from './index';

describe('GetTestTypes', () => {
  const getTestTypes = new GetTestTypes(testTypeRepository);

  beforeEach(async () => {
    await cleanupDatabase();

    const id1 = new TestTypeId();
    const id2 = new TestTypeId();

    await testTypeRepository.save(
      new TestType(id1, 'trusted', { type: 'boolean' }, true)
    );
    await testTypeRepository.save(
      new TestType(id2, 'untrusted', { type: 'boolean' }, false)
    );
  });

  describe('byTrusted true', () => {
    it('returns all test types', async () => {
      const testTypes = await getTestTypes.byTrusted(true);
      expect(testTypes.length).toBe(2);
    });
  });

  describe('byTrusted false', () => {
    it('returns only test types available to untrusted users', async () => {
      const testTypes = await getTestTypes.byTrusted(false);
      expect(testTypes.length).toBe(1);
    });
  });

  it('expects true to be true', () => {
    expect(true).toBe(true);
  });
});

afterAll(() => {
  return database.destroy();
});
