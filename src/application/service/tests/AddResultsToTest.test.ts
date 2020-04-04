import { testRepository, testTypeRepository } from '../../../infrastructure/persistence';
import { aTest, aTestType } from '../../../test/domainFactories';
import { persistedUserWithRoleAndPermissions } from '../../../test/persistedEntities';
import { ADD_RESULTS_WITH_HIGH_CONFIDENCE } from '../../../domain/model/authentication/Permissions';
import { aTestResultsCommand } from '../../../test/apiFactories';
import { ConfidenceLevel } from '../../../domain/model/test/ConfidenceLevel';
import database from '../../../database';
import { cleanupDatabase } from '../../../test/cleanupDatabase';
import { AddResultsToTest } from './AddResultsToTest';

describe('AddResultsToTests', () => {
  const addResultsToTest = new AddResultsToTest(testRepository);

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('adds results with LOW confidence if the actor does not have the necessary permission', async () => {
    const testType = await testTypeRepository.save(aTestType());
    const actor = await persistedUserWithRoleAndPermissions('TESTER', [testType.neededPermissionToAddResults]);
    const testedSubject = await persistedUserWithRoleAndPermissions('USER', []);
    const test = await testRepository.save(aTest(testedSubject.id, testType));

    const results = await addResultsToTest.execute(actor, test.id.value, aTestResultsCommand());

    expect(results.entryConfidence).toEqual(ConfidenceLevel.LOW);
  });

  it('adds results with HIGH confidence if the actor has the necessary permission', async () => {
    const testType = await testTypeRepository.save(aTestType());
    const actor = await persistedUserWithRoleAndPermissions('TESTER', [
      ADD_RESULTS_WITH_HIGH_CONFIDENCE,
      testType.neededPermissionToAddResults,
    ]);
    const testedSubject = await persistedUserWithRoleAndPermissions('USER', []);
    const test = await testRepository.save(aTest(testedSubject.id, testType));

    const results = await addResultsToTest.execute(actor, test.id.value, aTestResultsCommand());

    expect(results.entryConfidence).toEqual(ConfidenceLevel.HIGH);
  });
});

afterAll(() => {
  return database.destroy();
});
