import { testRepository, testTypeRepository } from '../../../infrastructure/persistence';
import { aTest, aTestType } from '../../../test/domainFactories';
import { persistedUserWithRoleAndPermissions } from '../../../test/persistedEntities';
import { ADD_RESULTS_WITH_HIGH_CONFIDENCE } from '../../../domain/model/authentication/Permissions';
import { aTestResultsCommand } from '../../../test/apiFactories';
import { ConfidenceLevel } from '../../../domain/model/test/ConfidenceLevel';
import database from '../../../database';
import { cleanupDatabase } from '../../../test/cleanupDatabase';
import { addResultsToTest } from '../index';
import { LoggingEmailNotifier } from '../../../infrastructure/notifications/LoggingEmailNotifier';

describe('AddResultsToTest', () => {
  let emailNotifierSpy: any;

  beforeEach(async () => {
    await cleanupDatabase();
    emailNotifierSpy = jest.spyOn(LoggingEmailNotifier.prototype, 'send');
    emailNotifierSpy.mockReset();
  });

  it('adds results with LOW confidence if the actor does not have the necessary permission', async () => {
    const testType = await testTypeRepository.save(aTestType());
    const actor = await persistedUserWithRoleAndPermissions('TESTER', [testType.neededPermissionToAddResults]);
    const testedSubject = await persistedUserWithRoleAndPermissions('USER', []);
    const test = await testRepository.save(aTest(testedSubject.id, testType));

    const results = await addResultsToTest.execute(actor, test.id.value, aTestResultsCommand());

    expect(results.creatorConfidence).toEqual(ConfidenceLevel.LOW);
  });

  it('adds results with HIGH confidence if the actor has the necessary permission & sends email to subject', async () => {
    const testType = await testTypeRepository.save(aTestType());
    const actor = await persistedUserWithRoleAndPermissions('TESTER', [
      ADD_RESULTS_WITH_HIGH_CONFIDENCE,
      testType.neededPermissionToAddResults,
    ]);
    const testedSubject = await persistedUserWithRoleAndPermissions('USER', []);
    const test = await testRepository.save(aTest(testedSubject.id, testType));

    const results = await addResultsToTest.execute(actor, test.id.value, aTestResultsCommand());

    expect(results.creatorConfidence).toEqual(ConfidenceLevel.HIGH);
    expect(emailNotifierSpy).toBeCalledTimes(1);
  });
});

afterAll(() => {
  return database.destroy();
});
