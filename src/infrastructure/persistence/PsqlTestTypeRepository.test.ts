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

  it('inserts new and retrieves a test type by id', async () => {
    const pcrPermission = 'PCR_PERMISSION';
    const takeHomePermission = 'TAKE_HOME_PERMISSION';
    const testType1 = await psqlTestTypeRepository.save(
      new TestType(new TestTypeId(), 'PCR', {}, pcrPermission)
    );
    const testType2 = await psqlTestTypeRepository.save(
      new TestType(new TestTypeId(), 'TAKE_HOME', {}, takeHomePermission)
    );

    const [
      persistedTestType1,
    ] = await psqlTestTypeRepository.findByPermissions([pcrPermission]);
    expect(persistedTestType1).toEqual(testType1);

    const [
      persistedTestType2,
    ] = await psqlTestTypeRepository.findByPermissions([takeHomePermission]);
    expect(persistedTestType2).toEqual(testType2);

    const allPermissions = await psqlTestTypeRepository.findByPermissions([
      pcrPermission,
      takeHomePermission,
    ]);
    expect(allPermissions.length).toEqual(2);
  });

  it('returns no testType if passed permission list is empty', async () => {
    await psqlTestTypeRepository.save(
      new TestType(new TestTypeId(), 'PCR', {}, 'PCR_PERMISSION')
    );
    await psqlTestTypeRepository.save(
      new TestType(new TestTypeId(), 'TAKE_HOME', {}, 'TAKE_HOME_PERMISSION')
    );

    const persistedTypes = await psqlTestTypeRepository.findByPermissions([]);

    expect(persistedTypes).toEqual([]);
  });

  it('returns no testType if passed permission does not match any test', async () => {
    await psqlTestTypeRepository.save(
      new TestType(new TestTypeId(), 'PCR', {}, 'PCR_PERMISSION')
    );
    await psqlTestTypeRepository.save(
      new TestType(new TestTypeId(), 'TAKE_HOME', {}, 'TAKE_HOME_PERMISSION')
    );

    const persistedTypes = await psqlTestTypeRepository.findByPermissions([]);

    expect(persistedTypes).toEqual([]);
  });
});

afterAll(() => {
  return database.destroy();
});
