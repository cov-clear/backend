import { getTestTypes, getReports } from '../../../application/service';
import { Request, Response } from 'express';
import { Authorized, Get, JsonController, UseBefore, Res, Req, QueryParam } from 'routing-controllers';
import { hasPermission } from '../../middleware/hasPermission';
import { VIEW_ADMIN_REPORTS } from '../../../domain/model/authentication/Permissions';
import { ApiError, apiErrorCodes } from '../../dtos/ApiError';
import { transformReportTestResultsToReport } from '../../transformers/reports/transformReportTestResultsToReport';

import { writeToStream } from '@fast-csv/format';

@Authorized()
@JsonController('/v1/reports')
export class ReportsController {
  private getReports = getReports;
  private getTestTypes = getTestTypes;

  @Get('/test-results')
  @UseBefore(hasPermission(VIEW_ADMIN_REPORTS))
  async getAllTestResultsTestTypeId(
    @QueryParam('testTypeId') testTypeId: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const testType = await this.getTestTypes.byId(testTypeId);

    if (!testType) {
      throw new ApiError(404, apiErrorCodes.TEST_TYPE_NOT_FOUND);
    }

    const tests = await this.getReports.getTestResultsByTestTypeTestId(testType.id);

    const reportFileName = 'TestResultsReport_' + Date.now() + '.csv';

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${reportFileName}`);
    return writeToStream(res, transformReportTestResultsToReport(tests, testType));
  }
}
