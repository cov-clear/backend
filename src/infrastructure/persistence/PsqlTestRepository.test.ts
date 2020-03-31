import database from '../../database';
import { PsqlTestRepository } from './PsqlTestRepository';
import { TestTypeId } from '../../domain/model/testType/TestTypeId';
import { Test } from '../../domain/model/test/Test';
import { TestId } from '../../domain/model/test/TestId';
import { User } from '../../domain/model/user/User';
import { UserId } from '../../domain/model/user/UserId';
import { Email } from '../../domain/model/user/Email';

import { cleanupDatabase } from '../../test/cleanupDatabase';

// TODO: Add results
describe('PsqlTestRepository', () => {
  const psqlTestRepository = new PsqlTestRepository(database);

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('inserts new and retrieves a test by id', async () => {
    const test = await psqlTestRepository.save(
      new Test(new TestId(), new UserId(), new TestTypeId())
    );

    const persistedTest = await psqlTestRepository.findById(test.id);

    expect(persistedTest).toEqual(test);
  });

  it('inserts two new tests and retrieves them by User Id', async () => {
    const userId = new UserId();
    const testTypeId = new TestTypeId();

    const test1 = new Test(new TestId(), userId, testTypeId);
    const test2 = new Test(new TestId(), userId, testTypeId);

    await psqlTestRepository.save(test1);
    await psqlTestRepository.save(test2);

    const persistedTests = await psqlTestRepository.findByUserId(userId);

    expect(persistedTests[0]).toEqual(test1);
    expect(persistedTests[1]).toEqual(test2);
  });
});

afterAll(() => {
  return database.destroy();
});
