import database from '../../database';
import { PsqlReportRepository } from './PsqlReportRepository';
import { PsqlTestRepository } from './PsqlTestRepository';

import { Test } from '../../domain/model/test/Test';
import { TestId } from '../../domain/model/test/TestId';
import { Results } from '../../domain/model/test/Results';
import { UserId } from '../../domain/model/user/UserId';

import { cleanupDatabase } from '../../test/cleanupDatabase';
import { ConfidenceLevel } from '../../domain/model/test/ConfidenceLevel';
import { aTest, aTestType } from '../../test/domainFactories';
import { testTypeRepository } from './';

describe('PsqlReportRepository', () => {
  const psqlReportRepository = new PsqlReportRepository(database, testTypeRepository);
  const psqlTestRepository = new PsqlTestRepository(database, testTypeRepository);

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('Gets report for a test without result details', async () => {
    const testType = await testTypeRepository.save(aTestType());
    const test = await psqlTestRepository.save(
      new Test(new TestId(), new UserId(), testType, new UserId(), ConfidenceLevel.LOW)
    );

    const reportTestResults = await psqlReportRepository.getTestResults(testType.id);

    expect(reportTestResults[0].id).toEqual(test.id);
    expect(reportTestResults[0].userId).toEqual(test.userId);
    expect(reportTestResults[0].testType.id).toEqual(test.testType.id);
    expect(reportTestResults[0].resultsDetails).toBeNull();
  });

  it('Gets report for multiple tests', async () => {
    const userId = new UserId();
    const testType = await testTypeRepository.save(aTestType());

    const test1 = await psqlTestRepository.save(aTest(userId, testType));
    const test2 = await psqlTestRepository.save(aTest(userId, testType));

    const reportTestResults = await psqlReportRepository.getTestResults(testType.id);

    expect(reportTestResults[0].id).toEqual(test2.id);
    expect(reportTestResults[0].userId).toEqual(test2.userId);
    expect(reportTestResults[0].testType.id).toEqual(test2.testType.id);
    expect(reportTestResults[0].resultsDetails).not.toBeNull();

    expect(reportTestResults[1].id).toEqual(test1.id);
    expect(reportTestResults[1].userId).toEqual(test1.userId);
    expect(reportTestResults[1].testType.id).toEqual(test1.testType.id);
    expect(reportTestResults[1].resultsDetails).not.toBeNull();
  });
});

afterAll(() => {
  return database.destroy();
});
