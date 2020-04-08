import database from '../../database';
import { PsqlTestTypeRepository } from './PsqlTestTypeRepository';
import { TestTypeId } from '../../domain/model/test/testType/TestTypeId';
import { TestType } from '../../domain/model/test/testType/TestType';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { antibodyTestTypeInterpretationRules, aTestType } from '../../test/domainFactories';
import { TestTypeNameAlreadyExists } from '../../domain/model/test/testType/TestTypeRepository';
import { InterpretationRules } from '../../domain/model/test/interpretation/InterpretationRules';
import { testTypeRepository } from './index';

describe('PsqlTestTypeRepository', () => {
  const psqlTestTypeRepository = new PsqlTestTypeRepository(database);

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('inserts new and retrieves a test type by trusted', async () => {
    const pcrPermission = 'PCR_PERMISSION';
    const takeHomePermission = 'TAKE_HOME_PERMISSION';
    const testType1 = await psqlTestTypeRepository.save(new TestType(new TestTypeId(), 'PCR', {}, pcrPermission));
    const testType2 = await psqlTestTypeRepository.save(
      new TestType(new TestTypeId(), 'TAKE_HOME', {}, takeHomePermission)
    );

    const [persistedTestType1] = await psqlTestTypeRepository.findByPermissions([pcrPermission]);
    expect(persistedTestType1).toEqual(testType1);

    const [persistedTestType2] = await psqlTestTypeRepository.findByPermissions([takeHomePermission]);
    expect(persistedTestType2).toEqual(testType2);

    const allPermissions = await psqlTestTypeRepository.findByPermissions([pcrPermission, takeHomePermission]);
    expect(allPermissions.length).toEqual(2);
  });

  it('throws error if name already exists', async () => {
    const testName = 'TAKE_HOME';
    await psqlTestTypeRepository.save(aTestType(testName));

    await expect(psqlTestTypeRepository.save(aTestType(testName))).rejects.toEqual(
      new TestTypeNameAlreadyExists(testName)
    );
  });

  it('returns no testType if passed permission list is empty', async () => {
    await psqlTestTypeRepository.save(new TestType(new TestTypeId(), 'PCR', {}, 'PCR_PERMISSION'));
    await psqlTestTypeRepository.save(new TestType(new TestTypeId(), 'TAKE_HOME', {}, 'TAKE_HOME_PERMISSION'));

    const persistedTypes = await psqlTestTypeRepository.findByPermissions([]);

    expect(persistedTypes).toEqual([]);
  });

  it('returns no testType if passed permission does not match any test', async () => {
    await psqlTestTypeRepository.save(new TestType(new TestTypeId(), 'PCR', {}, 'PCR_PERMISSION'));
    await psqlTestTypeRepository.save(new TestType(new TestTypeId(), 'TAKE_HOME', {}, 'TAKE_HOME_PERMISSION'));

    const persistedTypes = await psqlTestTypeRepository.findByPermissions([]);

    expect(persistedTypes).toEqual([]);
  });

  it('inserts new and retrieves a test type by id', async () => {
    const testType = await psqlTestTypeRepository.save(new TestType(new TestTypeId(), 'PCR', {}, 'PCR_PERMISSION'));

    const persistedTestType = await psqlTestTypeRepository.findById(testType.id);

    expect(persistedTestType).toEqual(testType);
  });

  it('inserts new and retrieves a test type containing interpretation rules', async () => {
    const interpretationRules = antibodyTestTypeInterpretationRules();

    const testType = await psqlTestTypeRepository.save(
      new TestType(new TestTypeId(), 'PCR', {}, 'PCR_PERMISSION', interpretationRules)
    );

    const persistedTestType = await psqlTestTypeRepository.findById(testType.id);

    expect(persistedTestType).toEqual(testType);
  });

  it('updates test type if testType already exists', async () => {
    const interpretationRules = antibodyTestTypeInterpretationRules();

    const testType = await psqlTestTypeRepository.save(
      new TestType(new TestTypeId(), 'PCR', {}, 'PCR_PERMISSION', interpretationRules)
    );

    testType.name = 'PCR 2';
    testType.interpretationRules = InterpretationRules.fromSchema([]);
    testType.resultsSchema = { type: 'object' };
    testType.neededPermissionToAddResults = 'NEW_PERMISSION';
    await psqlTestTypeRepository.save(testType);

    const persistedTestType = await testTypeRepository.findById(testType.id);

    expect(persistedTestType).toEqual(testType);
  });

  it('updating a name fails if it collides with an existing name', async () => {
    const testType1 = await testTypeRepository.save(aTestType('NAME1'));
    const testType2 = await testTypeRepository.save(aTestType('NAME2'));

    testType2.name = testType1.name;

    await expect(psqlTestTypeRepository.save(testType2)).rejects.toEqual(new TestTypeNameAlreadyExists(testType1.name));
  });
});
afterAll(() => {
  return database.destroy();
});
