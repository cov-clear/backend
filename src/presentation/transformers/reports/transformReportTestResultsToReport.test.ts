import { aReportTestResult, aResult, aTestType } from '../../../test/domainFactories';
import { transformReportTestResultsToReport } from './transformReportTestResultsToReport';
import { ReportTestResult } from '../../../domain/model/reports/ReportTestResult';

describe('transformReportTestResultsToReport', () => {
  it('correctly transforms a ReportTestResult to Report data', () => {
    const testType = aTestType();

    const reportTestResult1 = aReportTestResult();
    const reportTestResult2 = aReportTestResult();

    const reportTestResults = Array<ReportTestResult>();
    reportTestResults.push(reportTestResult1);
    reportTestResults.push(reportTestResult2);

    const reportData = transformReportTestResultsToReport(reportTestResults, testType);

    // Test headers
    expect(reportData[0].id).toEqual('Test Id');
    expect(reportData[0].userId).toEqual('User Id');
    expect(reportData[0].testTypeName).toEqual('Test Type Name');
    expect(reportData[0].c).toEqual('C');
    expect(reportData[0].igg).toEqual('IgG');
    expect(reportData[0].igm).toEqual('IgM');

    expect(reportData[1].id).not.toEqual(reportTestResult1.id.value);
    expect(reportData[1].userId).not.toEqual(reportTestResult1.userId);
    expect(reportData[1].testTypeName).toEqual(testType.name);
    expect(reportData[1].c).toBeTruthy();
    expect(reportData[1].igg).toBeTruthy();
    expect(reportData[1].igm).toBeTruthy();

    expect(reportData[2].id).not.toEqual(reportTestResult2.id.value);
    expect(reportData[2].userId).not.toEqual(reportTestResult2.userId);
    expect(reportData[2].testTypeName).toEqual(testType.name);
    expect(reportData[2].c).toBeTruthy();
    expect(reportData[2].igg).toBeTruthy();
    expect(reportData[2].igm).toBeTruthy();
  });
});
