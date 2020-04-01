import database from '../../database';
import { PsqlTestRepository } from './PsqlTestRepository';
import { TestTypeId } from '../../domain/model/testType/TestTypeId';
import { Test } from '../../domain/model/test/Test';
import { TestId } from '../../domain/model/test/TestId';
import { Results } from '../../domain/model/test/Results';
import { UserId } from '../../domain/model/user/UserId';

import { cleanupDatabase } from '../../test/cleanupDatabase';

describe('PsqlTestRepository', () => {
  const psqlTestRepository = new PsqlTestRepository(database);

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('inserts a test without results and retrieves it by id', async () => {
    const test = await psqlTestRepository.save(new Test(new TestId(), new UserId(), new TestTypeId()));

    const persistedTest = await psqlTestRepository.findById(test.id);

    expect(persistedTest).toEqual(test);
  });

  it('inserts a test with results and retrieves it by id', async () => {
    const userId = new UserId();
    const details = { a: 1 };
    const results = new Results(userId, details);

    const test = await psqlTestRepository.save(new Test(new TestId(), userId, new TestTypeId(), results));

    const persistedTest = await psqlTestRepository.findById(test.id)!;

    expect(persistedTest).toEqual(test);
    expect(persistedTest?.results).toBeDefined();
    expect(persistedTest?.results).not.toBeNull();
    expect(persistedTest?.results?.details).toEqual(details);
  });

  it('inserts two new tests and retrieves them by User Id', async () => {
    const userId = new UserId();
    const testTypeId = new TestTypeId();

    const test1 = new Test(new TestId(), userId, testTypeId, undefined, new Date(Date.now() - 10000));
    const test2 = new Test(new TestId(), userId, testTypeId, undefined, new Date(Date.now()));

    await psqlTestRepository.save(test1);
    await psqlTestRepository.save(test2);

    const persistedTests = await psqlTestRepository.findByUserId(userId);

    expect(persistedTests[0]).toEqual(test1);
    expect(persistedTests[1]).toEqual(test2);
  });

  it('updates a test with results', async () => {
    const userId = new UserId();
    const details = { a: 1 };
    const test = await psqlTestRepository.save(new Test(new TestId(), userId, new TestTypeId()));

    test.results = new Results(userId, details);
    await psqlTestRepository.save(test);

    const persistedTest = await psqlTestRepository.findById(test.id);

    expect(persistedTest?.results).toEqual(test.results);
  });
});

afterAll(() => {
  return database.destroy();
});
