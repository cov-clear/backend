import * as crypto from 'crypto';
import { ReportTestResult } from '../../../domain/model/reports/ReportTestResult';
import { v4 } from 'uuid';
import { TestType } from '../../../domain/model/test/testType/TestType';

export function transformReportTestResultsToReport(tests: Array<ReportTestResult>, testType: TestType): Array<any> {
  const secret = v4();
  const resultsSchema = testType.resultsSchema as any;

  const schemaProperties = Object.entries(resultsSchema.properties).map(([key, value]) => ({
    key: key,
    header: (value as any).title,
  }));

  const headers = getHeadersForReport(schemaProperties);

  let reportData: Array<any>;
  reportData = tests.map((test) => {
    return transformReportTestResult(test, secret, schemaProperties);
  });
  reportData.unshift(headers);

  return reportData;
}

export function getHeadersForReport(schemaProperties: Array<any>): object {
  const headers: any = {
    id: 'Test Id',
    userId: 'User Id',
    testTypeName: 'Test Type Name',
    testCreationTime: 'Test Creation Time',
    testCreatorConfidence: 'Test Creator Confidence',
    resultsCreatorConfidence: 'Results Creator Confidence',
    resultsCreationTime: 'Results Creation Time',
  };

  schemaProperties.forEach((property) => (headers[property.key] = property.header));

  return headers;
}

export function transformReportTestResult(
  test: ReportTestResult,
  secret: string,
  headerDefinitions: Array<any>
): object {
  const resultDetails = test.resultsDetails as any;

  const result: any = {
    id: crypto.createHmac('sha256', secret).update(test.id.value).digest('hex'),
    userId: crypto.createHmac('sha256', secret).update(test.userId.value).digest('hex'),
    testTypeName: test.testType.name,
    testCreationTime: test.testCreationTime.toString(),
    testCreatorConfidence: test.testCreatorConfidence,
    resultsCreatorConfidence: test.resultsCreatorConfidence,
    resultsCreationTime: test.resultsCreationTime ? test.resultsCreationTime.toString() : null,
  };

  if (resultDetails) {
    headerDefinitions.forEach(
      (headerDefinition) => (result[headerDefinition.key] = resultDetails[headerDefinition.key] as any)
    );
  }

  return result;
}
