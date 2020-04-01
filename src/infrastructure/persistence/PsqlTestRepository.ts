import knex from 'knex';
import { TestRepository } from '../../domain/model/test/TestRepository';
import { Test } from '../../domain/model/test/Test';
import { TestId } from '../../domain/model/test/TestId';
import { TestTypeId } from '../../domain/model/testType/TestTypeId';
import { UserId } from '../../domain/model/user/UserId';
import { Results } from '../../domain/model/test/Results';

const TEST_TABLE_NAME = 'test';
const TEST_RESULTS_TABLE_NAME = 'test_results';

const TEST_TABLE_COLUMNS = [
  `${TEST_TABLE_NAME}.id`,
  `${TEST_TABLE_NAME}.user_id as userId`,
  `${TEST_TABLE_NAME}.test_type_id as testTypeId`,
  `${TEST_TABLE_NAME}.creation_time as creationTime`,
  `${TEST_RESULTS_TABLE_NAME}.details as details`,
  `${TEST_RESULTS_TABLE_NAME}.creator_id as resultsCreatorId`,
  `${TEST_RESULTS_TABLE_NAME}.creation_time as resultsCreationTime`,
];

export class PsqlTestRepository implements TestRepository {
  constructor(private db: knex) {}

  async save(test: Test) {
    const transaction = await this.db.transaction();
    try {
      await Promise.all([this.saveTest(test), this.saveTestResults(test)]);
      transaction.commit();
    } catch (e) {
      transaction.rollback();
    }
    return test;
  }

  async findById(testId: TestId) {
    const testRow: any = await this.getAllTestsQueryBuilder()
      .where(`${TEST_TABLE_NAME}.id`, '=', testId.value)
      .first();

    if (!testRow) {
      return null;
    }

    return createResultsFromRow(testRow);
  }

  async findByUserId(userId: UserId) {
    let testRows: Array<any>;

    testRows = await this.getAllTestsQueryBuilder()
      .where(`${TEST_TABLE_NAME}.user_id`, '=', userId.value)
      .orderBy(`${TEST_TABLE_NAME}.creation_time`, 'asc');

    if (!testRows) {
      return [];
    }

    return testRows.map(createResultsFromRow);
  }

  private async saveTest(test: Test) {
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

  private async saveTestResults(test: Test) {
    if (!test.results) {
      return;
    }
    return await this.db
      .raw(
        `
      insert into "${TEST_RESULTS_TABLE_NAME}" (
        id,
        test_id,
        creator_id,
        details,
        creation_time
      )
      values (
        :id,
        :test_id,
        :creator_id,
        :details,
        :creation_time
      )
      on conflict(id) do nothing
    `,
        {
          id: test.id.value,
          test_id: test.id.value,
          creator_id: test.results.createdBy.value,
          details: JSON.stringify(test.results.details),
          creation_time: test.results.creationTime,
        }
      )
      .then(() => {
        return test;
      });
  }

  private getAllTestsQueryBuilder() {
    return this.db(TEST_TABLE_NAME)
      .select(TEST_TABLE_COLUMNS)
      .leftJoin(
        TEST_RESULTS_TABLE_NAME,
        `${TEST_TABLE_NAME}.id`,
        `${TEST_RESULTS_TABLE_NAME}.test_id`
      );
  }
}

function createResultsFromRow(testRow: any): Test {
  const results = testRow.details
    ? new Results(
        new UserId(testRow.resultsCreatorId),
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
