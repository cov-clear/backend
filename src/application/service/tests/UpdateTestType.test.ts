import database from '../../../database';
import { testTypeRepository } from '../../../infrastructure/persistence';
import { cleanupDatabase } from '../../../test/cleanupDatabase';
import { UpdateTestType } from './UpdateTestType';
import { TestTypeId } from '../../../domain/model/test/testType/TestTypeId';
import { TestTypeNotFoundError } from '../../../domain/model/test/testType/TestTypeRepository';
import { v4 } from 'uuid';
import { aTestType } from '../../../test/domainFactories';
import { InterpretationRules } from '../../../domain/model/test/interpretation/InterpretationRules';

describe('UpdateTestType', () => {
  const updateTestType = new UpdateTestType(testTypeRepository);

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('throws not found error if test type id does not exist', async () => {
    const testTypeId = new TestTypeId().value;
    await expect(updateTestType.execute(testTypeId, { name: 'NEW_NAME' })).rejects.toEqual(
      new TestTypeNotFoundError(testTypeId)
    );
  });

  it('updates the test type name', async () => {
    const testType = await testTypeRepository.save(aTestType());
    const newName = 'SOME_UNIQUE_NEW_NAME';

    await updateTestType.execute(testType.id.value, { name: newName });

    const persistedTestType = await testTypeRepository.findById(testType.id);

    expect(persistedTestType?.name).toEqual(newName);
  });

  it('updates the resultsSchema', async () => {
    const testType = await testTypeRepository.save(aTestType());
    const newResultsSchema = { type: 'object' };

    await updateTestType.execute(testType.id.value, { resultsSchema: newResultsSchema });

    const persistedTestType = await testTypeRepository.findById(testType.id);

    expect(persistedTestType?.resultsSchema).toEqual(newResultsSchema);
  });

  it('updates the neededPermissionToAddResults', async () => {
    const testType = await testTypeRepository.save(aTestType());
    const newNeededPermissionToAddResults = 'SOME_NEW_PERMISSION';

    await updateTestType.execute(testType.id.value, { neededPermissionToAddResults: newNeededPermissionToAddResults });

    const persistedTestType = await testTypeRepository.findById(testType.id);

    expect(persistedTestType?.neededPermissionToAddResults).toEqual(newNeededPermissionToAddResults);
  });

  it('updates the interpretationRules', async () => {
    const testType = await testTypeRepository.save(aTestType());
    const newInterpretationRules = InterpretationRules.fromSchema([
      {
        output: {
          namePattern: 'Some new pattern',
          theme: 'NEGATIVE',
        },
        condition: { type: 'object' },
      },
    ]);

    await updateTestType.execute(testType.id.value, { interpretationRules: newInterpretationRules.toSchema() });

    const persistedTestType = await testTypeRepository.findById(testType.id);

    expect(persistedTestType?.interpretationRules).toEqual(newInterpretationRules);
  });
});

afterAll(() => {
  return database.destroy();
});
