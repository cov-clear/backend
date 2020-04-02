import database from '../../database';
import { PsqlTestRepository } from './PsqlTestRepository';
import { TestTypeId } from '../../domain/model/testType/TestTypeId';
import { Test } from '../../domain/model/test/Test';
import { TestId } from '../../domain/model/test/TestId';
import { Results } from '../../domain/model/test/Results';
import { UserId } from '../../domain/model/user/UserId';

import { cleanupDatabase } from '../../test/cleanupDatabase';
import { ConfidenceLevel } from '../../domain/model/test/ConfidenceLevel';

describe('PsqlTestRepository', () => {
  const psqlTestRepository = new PsqlTestRepository(database);

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('inserts a test without results and retrieves it by id', async () => {
    const test = await psqlTestRepository.save(
      new Test(new TestId(), new UserId(), new TestTypeId(), ConfidenceLevel.LOW)
    );

    const persistedTest = await psqlTestRepository.findById(test.id);

    expect(persistedTest).toEqual(test);
  });

  it('inserts a test with results and retrieves it by id', async () => {
    const userId = new UserId();
    const details = { a: 1 };
    const results = new Results(userId, details, ConfidenceLevel.LOW);

    const test = await psqlTestRepository.save(
      new Test(new TestId(), userId, new TestTypeId(), ConfidenceLevel.HIGH, results)
    );

    const persistedTest = await psqlTestRepository.findById(test.id)!;

    expect(persistedTest).toEqual(test);
    expect(persistedTest?.results).toBeDefined();
    expect(persistedTest?.results).not.toBeNull();
    expect(persistedTest?.results?.details).toEqual(details);
  });

  it('inserts two new tests and retrieves them by User Id', async () => {
    const userId = new UserId();
    const testTypeId = new TestTypeId();

    const test1 = new Test(
      new TestId(),
      userId,
      testTypeId,
      ConfidenceLevel.LOW,
      undefined,
      new Date(Date.now() - 10000)
    );
    const test2 = new Test(new TestId(), userId, testTypeId, ConfidenceLevel.HIGH, undefined, new Date(Date.now()));

    await psqlTestRepository.save(test1);
    await psqlTestRepository.save(test2);

    const persistedTests = await psqlTestRepository.findByUserId(userId);

    expect(persistedTests[0]).toEqual(test1);
    expect(persistedTests[1]).toEqual(test2);
  });

  it('updates a test with results containing notes', async () => {
    const userId = new UserId();
    const details = { a: 1 };
    const notes = 'notes for test results';

    const test = await psqlTestRepository.save(new Test(new TestId(), userId, new TestTypeId(), ConfidenceLevel.LOW));

    test.results = new Results(userId, details, ConfidenceLevel.HIGH, notes);

    await psqlTestRepository.save(test);

    const persistedTest = await psqlTestRepository.findById(test.id);

    expect(persistedTest?.results).toEqual(test.results);
    expect(persistedTest?.results?.notes).toEqual(notes);
  });
});

afterAll(() => {
  return database.destroy();
});
