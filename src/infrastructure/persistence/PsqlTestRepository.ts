import knex from 'knex';
import { TestRepository } from '../../domain/model/test/TestRepository';
import { Test } from '../../domain/model/test/Test';
import { TestId } from '../../domain/model/test/TestId';
import { TestTypeId } from '../../domain/model/testType/TestTypeId';
import { UserId } from '../../domain/model/user/UserId';

const TEST_TABLE_NAME = 'test';

export class PsqlTestRepository implements TestRepository {
  constructor(private db: knex) {}

  async findById(testId: TestId) {
    const linkRow: any = await this.db(TEST_TABLE_NAME)
      .select([
        'id',
        'user_id as userId',
        'test_type_id as testTypeId',
        'creation_time as creationTime',
      ])
      .where('id', '=', testId.value)
      .first();

    if (!linkRow) {
      return null;
    }
    return new Test(
      new TestId(linkRow.id),
      new UserId(linkRow.userId),
      new TestTypeId(linkRow.testTypeId),
      linkRow.creationTime
    );
  }

  async save(test: Test) {
    return await this.db
      .raw(
        `
      insert into "${TEST_TABLE_NAME}" (id, user_id, test_type_id, creation_time)
      values (:id, :user_id, :test_type_id, :creation_time)
      on conflict(id) do nothing
    `,
        {
          id: test.id.value,
          user_id: test.userId.value,
          test_type_id: test.testTypeId.value,
          creation_time: test.creationTime,
        }
      )
      .then(() => {
        return test;
      });
  }
}
