import { TestTypeId } from '../../../domain/model/test/testType/TestTypeId';
import { ReportRepository } from '../../../domain/model/reports/ReportRepository';
import { ReportTestResult } from '../../../domain/model/reports/ReportTestResult';

export class GetReports {
  constructor(private reportRepository: ReportRepository) {}

  async getTestResults(testTypeId: TestTypeId): Promise<Array<ReportTestResult>> {
    return this.reportRepository.getTestResults(testTypeId);
  }
}
