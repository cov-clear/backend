import knex from 'knex';
import { TestRepository } from '../../domain/model/test/TestRepository';
import { Test } from '../../domain/model/test/Test';
import { TestId } from '../../domain/model/test/TestId';
import { TestTypeId } from '../../domain/model/testType/TestTypeId';
import { UserId } from '../../domain/model/user/UserId';
import { Results } from '../../domain/model/test/Results';

const TEST_TABLE_NAME = 'test';

const TEST_TABLE_COLUMNS = [
  'id',
  'user_id as userId',
  'test_type_id as testTypeId',
  'creation_time as creationTime',
  'results as details',
  'results_creator_id as testerUserId',
  'results_creation_time as resultsCreationTime',
];

export class PsqlTestRepository implements TestRepository {
  constructor(private db: knex) {}

  async save(test: Test) {
    if (test.results) {
      return this.saveWithResults(test, test.results);
    } else {
      return this.saveWithoutResults(test);
    }
  }

  async findById(testId: TestId) {
    const testRow: any = await this.db(TEST_TABLE_NAME)
      .where('id', '=', testId.value)
      .select(TEST_TABLE_COLUMNS)
      .first();

    if (!testRow) {
      return null;
    }

    return this.createResultsFromRow(testRow);
  }

  async findByUserId(userId: UserId) {
    let testRows: Array<any>;

    testRows = await this.db(TEST_TABLE_NAME)
      .where('user_id', '=', userId.value)
      .select(TEST_TABLE_COLUMNS)
      .orderBy('creation_time', 'asc');

    if (!testRows) {
      return [];
    }

    return testRows.map(this.createResultsFromRow);
  }

  private async saveWithoutResults(test: Test) {
    return await this.db
      .raw(
        `
      insert into "${TEST_TABLE_NAME}" (
        id,
        user_id,
        test_type_id,
        creation_time
      )
      values (
        :id,
        :user_id,
        :test_type_id,
        :creation_time
      )
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

  private async saveWithResults(test: Test, results: Results) {
    return await this.db
      .raw(
        `
      insert into "${TEST_TABLE_NAME}" (
        id,
        user_id,
        test_type_id,
        creation_time,
        results,
        results_creator_id,
        results_creation_time
      )
      values (
        :id,
        :user_id,
        :test_type_id,
        :creation_time,
        :results,
        :results_creator_id,
        :results_creation_time
      )
      on conflict(id) do nothing
    `,
        {
          id: test.id.value,
          user_id: test.userId.value,
          test_type_id: test.testTypeId.value,
          creation_time: test.creationTime,
          results: JSON.stringify(results.details),
          results_creator_id: results.createdBy.value,
          results_creation_time: results.creationTime,
        }
      )
      .then(() => {
        return test;
      });
  }

  private createResultsFromRow(testRow: any): Test {
    const results = testRow.details
      ? new Results(
          new UserId(testRow.testerUserId),
          testRow.details,
          testRow.resultsCreationTime
        )
      : undefined;

    return new Test(
      new TestId(testRow.id),
      new UserId(testRow.userId),
      new TestTypeId(testRow.testTypeId),
      results,
      testRow.creationTime
    );
  }
}
