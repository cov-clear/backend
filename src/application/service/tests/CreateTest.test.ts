import { testRepository, testTypeRepository } from '../../../infrastructure/persistence';
import { aTestType } from '../../../test/domainFactories';
import { persistedUserWithRoleAndPermissions } from '../../../test/persistedEntities';
import { ADMINISTER_TEST_WITH_HIGH_CONFIDENCE } from '../../../domain/model/authentication/Permissions';
import { CreateTest } from './CreateTest';
import { aCreateTestCommand } from '../../../test/apiFactories';
import { ConfidenceLevel } from '../../../domain/model/test/ConfidenceLevel';
import database from '../../../database';
import { cleanupDatabase } from '../../../test/cleanupDatabase';
import { addResultsToTest } from '../';

describe('CreateTest', () => {
  const createTest = new CreateTest(testRepository, testTypeRepository, addResultsToTest);

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('creates a test with LOW confidence if the actor does not have the necessary permission', async () => {
    const testType = await testTypeRepository.save(aTestType());
    const actor = await persistedUserWithRoleAndPermissions('TESTER', []);
    const testedSubject = await persistedUserWithRoleAndPermissions('USER', []);

    const test = await createTest.execute(actor, testedSubject.id.value, aCreateTestCommand(testType.id));

    expect(test.administrationConfidence).toEqual(ConfidenceLevel.LOW);
  });

  it('creates a test with HIGH confidence if the actor has the necessary permission', async () => {
    const testType = await testTypeRepository.save(aTestType());
    const actor = await persistedUserWithRoleAndPermissions('TESTER', [ADMINISTER_TEST_WITH_HIGH_CONFIDENCE]);
    const testedSubject = await persistedUserWithRoleAndPermissions('USER', []);

    const test = await createTest.execute(actor, testedSubject.id.value, aCreateTestCommand(testType.id));

    expect(test.administrationConfidence).toEqual(ConfidenceLevel.HIGH);
  });
});

afterAll(() => {
  return database.destroy();
});
