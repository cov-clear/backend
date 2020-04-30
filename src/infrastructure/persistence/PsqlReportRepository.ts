import knex from 'knex';
import { TestTypeMissingForTestError } from '../../domain/model/test/TestRepository';
import { TestId } from '../../domain/model/test/TestId';
import { TestTypeId } from '../../domain/model/test/testType/TestTypeId';
import { UserId } from '../../domain/model/user/UserId';
import { TestType } from '../../domain/model/test/testType/TestType';
import { TestTypeRepository } from '../../domain/model/test/testType/TestTypeRepository';
import { ReportRepository } from '../../domain/model/reports/ReportRepository';
import { ReportTestResult } from '../../domain/model/reports/ReportTestResult';

const TEST_TABLE_NAME = 'test';
const TEST_RESULTS_TABLE_NAME = 'test_results';

const TEST_TABLE_COLUMNS = [
  `${TEST_TABLE_NAME}.id`,
  `${TEST_TABLE_NAME}.user_id as userId`,
  `${TEST_TABLE_NAME}.test_type_id as testTypeId`,
  `${TEST_TABLE_NAME}.creation_time as testCreationTime`,
  `${TEST_TABLE_NAME}.creator_user_id as testCreatorUserId`,
  `${TEST_TABLE_NAME}.creator_confidence as testCreatorConfidence`,
  `${TEST_RESULTS_TABLE_NAME}.creator_user_id as resultsCreatorUserId`,
  `${TEST_RESULTS_TABLE_NAME}.details as resultsDetails`,
  `${TEST_RESULTS_TABLE_NAME}.notes as resultsNotes`,
  `${TEST_RESULTS_TABLE_NAME}.creator_confidence as resultsCreatorConfidence`,
  `${TEST_RESULTS_TABLE_NAME}.creation_time as resultsCreationTime`,
];

export class PsqlReportRepository implements ReportRepository {
  constructor(private db: knex, private testTypeRepository: TestTypeRepository) {}

  async getTestResults(testTypeId: TestTypeId) {
    const testTypesById = await this.getTestTypesMapById();
    let testRows: Array<any>;

    testRows = await this.getAllTestsQueryBuilder()
      .where(`${TEST_TABLE_NAME}.test_type_id`, '=', testTypeId.value)
      .orderBy(`${TEST_TABLE_NAME}.creation_time`, 'desc');

    if (!testRows) {
      return [];
    }

    return testRows.map((testRow) => createReportTestResultFromRow(testRow, testTypesById.get(testRow.testTypeId)));
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

function createReportTestResultFromRow(testRow: any, testType?: TestType): ReportTestResult {
  if (!testType) {
    throw new TestTypeMissingForTestError(testRow.id, testRow.testTypeId);
  }

  const reportTestResult = new ReportTestResult(
    new TestId(testRow.id),
    new UserId(testRow.userId),
    testType,
    testRow.testCreatorConfidence,
    testRow.testCreationTime,
    testRow.resultsDetails,
    testRow.resultsDetails ? testRow.resultsCreatorConfidence : null,
    testRow.resultsCreationTime
  );

  return reportTestResult;
}
