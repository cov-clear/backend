import { TestTypeId } from '../test/testType/TestTypeId';
import { ReportTestResult } from './ReportTestResult';

export interface ReportRepository {
  // Use only for data export in MVP. Heavy query to DB.
  getTestResults(testTypeId: TestTypeId): Promise<Array<ReportTestResult>>;
}

export class TestTypeMissingForTestError extends Error {
  constructor(readonly testId: string, readonly testTypeId: string) {
    super(`Unexpected error. Could not find testType for test.`);
  }
}
