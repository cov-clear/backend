import knex from 'knex';
import { TestRepository, TestTypeMissingForTestError } from '../../domain/model/test/TestRepository';
import { Test } from '../../domain/model/test/Test';
import { TestId } from '../../domain/model/test/TestId';
import { TestTypeId } from '../../domain/model/test/testType/TestTypeId';
import { UserId } from '../../domain/model/user/UserId';
import { Results } from '../../domain/model/test/Results';
import { ConfidenceLevel } from '../../domain/model/test/ConfidenceLevel';
import { TestType } from '../../domain/model/test/testType/TestType';
import { TestTypeRepository } from '../../domain/model/test/testType/TestTypeRepository';
import { countRowsInTable } from './utils';

const TEST_TABLE_NAME = 'test';
const TEST_RESULTS_TABLE_NAME = 'test_results';

const TEST_TABLE_COLUMNS = [
  `${TEST_TABLE_NAME}.id`,
  `${TEST_TABLE_NAME}.user_id as userId`,
  `${TEST_TABLE_NAME}.test_type_id as testTypeId`,
  `${TEST_TABLE_NAME}.creation_time as creationTime`,
  `${TEST_TABLE_NAME}.creator_user_id as testCreatorUserId`,
  `${TEST_TABLE_NAME}.creator_confidence as testCreatorConfidence`,
  `${TEST_RESULTS_TABLE_NAME}.creator_user_id as resultsCreatorUserId`,
  `${TEST_RESULTS_TABLE_NAME}.details as resultsDetails`,
  `${TEST_RESULTS_TABLE_NAME}.notes as resultsNotes`,
  `${TEST_RESULTS_TABLE_NAME}.creator_confidence as resultsCreatorConfidence`,
  `${TEST_RESULTS_TABLE_NAME}.creation_time as resultsCreationTime`,
];

export class PsqlTestRepository implements TestRepository {
  constructor(private db: knex, private testTypeRepository: TestTypeRepository) {}

  async getTotalAmountOfTests(): Promise<number> {
    return countRowsInTable(this.db, TEST_TABLE_NAME);
  }

  async save(test: Test) {
    const transaction = await this.db.transaction();
    try {
      await Promise.all([this.saveTest(test), this.saveTestResults(test)]);
      transaction.commit();
    } catch (error) {
      transaction.rollback();
      throw error;
    }
    return test;
  }

  async findById(testId: TestId) {
    const testRow: any = await this.getAllTestsQueryBuilder().where(`${TEST_TABLE_NAME}.id`, '=', testId.value).first();
    if (!testRow) {
      return null;
    }

    const testType = await this.testTypeRepository.findById(new TestTypeId(testRow.testTypeId));
    if (!testType) {
      throw new TestTypeMissingForTestError(testId.value, testRow.testTypeId);
    }

    return createTestFromRow(testRow, testType);
  }

  async findByUserId(userId: UserId) {
    const testTypesById = await this.getTestTypesMapById();
    let testRows: Array<any>;

    testRows = await this.getAllTestsQueryBuilder()
      .where(`${TEST_TABLE_NAME}.user_id`, '=', userId.value)
      .orderBy(`${TEST_TABLE_NAME}.creation_time`, 'asc');

    if (!testRows) {
      return [];
    }

    return testRows.map((testRow) => createTestFromRow(testRow, testTypesById.get(testRow.testTypeId)));
  }

  private async saveTest(test: Test) {
    return await this.db
      .raw(
        `
      insert into "${TEST_TABLE_NAME}" (
        id,
        user_id,
        test_type_id,
        creator_user_id,
        creator_confidence,
        creation_time
      )
      values (
        :id,
        :user_id,
        :test_type_id,
        :creator_user_id,
        :creator_confidence,
        :creation_time
      )
      on conflict(id) do nothing
    `,
        {
          id: test.id.value,
          user_id: test.userId.value,
          creator_user_id: test.creatorUserId.value,
          test_type_id: test.testType.id.value,
          creator_confidence: test.creatorConfidence,
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
        creator_user_id,
        creator_confidence,
        details,
        notes,
        creation_time
      )
      values (
        :id,
        :test_id,
        :creator_user_id,
        :creator_confidence,
        :details,
        :notes,
        :creation_time
      )
      on conflict(test_id) do update
      set creator_user_id = excluded.creator_user_id,
         creator_confidence = excluded.creator_confidence,
         details = excluded.details,
         notes = excluded.notes,
         creation_time = excluded.creation_time
    `,
        {
          id: test.id.value,
          test_id: test.id.value,
          creator_user_id: test.results.creatorUserId.value,
          creator_confidence: test.results.creatorConfidence,
          details: JSON.stringify(test.results.details),
          notes: test.results.notes,
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
      .leftJoin(TEST_RESULTS_TABLE_NAME, `${TEST_TABLE_NAME}.id`, `${TEST_RESULTS_TABLE_NAME}.test_id`);
  }

  private async getTestTypesMapById() {
    const testTypes = await this.testTypeRepository.findAll();
    return testTypes.reduce((map, testType) => map.set(testType.id.value, testType), new Map<string, TestType>());
  }
}

function createTestFromRow(testRow: any, testType?: TestType): Test {
  if (!testType) {
    throw new TestTypeMissingForTestError(testRow.id, testRow.testTypeId);
  }
  const test = new Test(
    new TestId(testRow.id),
    new UserId(testRow.userId),
    testType,
    new UserId(testRow.testCreatorUserId),
    ConfidenceLevel.fromString(testRow.testCreatorConfidence),
    testRow.creationTime
  );
  Reflect.set(test, '_results', createResultsFromRow(testRow));
  return test;
}

function createResultsFromRow(testRow: any) {
  return testRow.resultsDetails
    ? new Results(
        new UserId(testRow.resultsCreatorUserId),
        testRow.resultsDetails,
        ConfidenceLevel.fromString(testRow.resultsCreatorConfidence),
        testRow.resultsNotes,
        testRow.resultsCreationTime
      )
    : undefined;
}
