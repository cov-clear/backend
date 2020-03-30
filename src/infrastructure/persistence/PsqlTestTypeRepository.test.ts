import database from '../../database';
import { PsqlTestTypeRepository } from './PsqlTestTypeRepository';
import { TestTypeId } from '../../domain/model/testType/TestTypeId';
import { TestType } from '../../domain/model/testType/TestType';
import { cleanupDatabase } from '../../test/cleanupDatabase';

describe('PsqlTestTypeRepository', () => {
  const psqlTestTypeRepository = new PsqlTestTypeRepository(database);

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('inserts new and retrieves a test type by trusted', async () => {
    const testType = await psqlTestTypeRepository.save(
      new TestType(new TestTypeId(), 'PCR', {}, true)
    );

    const [persistedTestType] = await psqlTestTypeRepository.findByTrusted(
      true
    );

    expect(persistedTestType).toEqual(testType);
  });

  it('inserts new and retrieves a test type by id', async () => {
    const testType = await psqlTestTypeRepository.save(
      new TestType(new TestTypeId(), 'PCR', {}, true)
    );

    const persistedTestType = await psqlTestTypeRepository.findById(
      testType.id
    );

    expect(persistedTestType).toEqual(testType);
  });
});

afterAll(() => {
  return database.destroy();
});
