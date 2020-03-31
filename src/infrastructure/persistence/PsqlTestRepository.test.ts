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
    const testTypeId = new TestTypeId();

    const user = new User(new UserId(), new Email('harsh@example.com'));

    const test = await psqlTestRepository.save(
      new Test(new TestId(), user.id, testTypeId, new Date())
    );

    const persistedTest = await psqlTestRepository.findById(test.id);

    expect(persistedTest).toEqual(test);
  });

  it('inserts two new tests and retrieves them by User Id', async () => {
    const user = new User(new UserId(), new Email('harsh@example.com'));

    const testTypeId = new TestTypeId();

    let tests = Array<Test>();
    tests.push(new Test(new TestId(), user.id, testTypeId, new Date()));
    tests.push(new Test(new TestId(), user.id, testTypeId, new Date()));

    for (let test of tests) {
      await psqlTestRepository.save(test);
    }

    const persistedTest = await psqlTestRepository.findByUserId(user.id);
    expect(persistedTest).toEqual(tests);
  });
});

afterAll(() => {
  return database.destroy();
});
