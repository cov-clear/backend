import { writeToStream } from '@fast-csv/format';
import { Request, Response } from 'express';
import { Authorized, Get, JsonController, UseBefore, Res, Req, QueryParam, CurrentUser } from 'routing-controllers';
import { getTestTypes, getReports } from '../../../application/service';
import { hasPermission } from '../../middleware/hasPermission';
import { VIEW_ADMIN_REPORTS } from '../../../domain/model/authentication/Permissions';
import { ApiError, apiErrorCodes } from '../../dtos/ApiError';
import { transformReportTestResultsToReport } from '../../transformers/reports/transformReportTestResultsToReport';
import log from '../../../infrastructure/logging/logger';
import { User } from '../../../domain/model/user/User';
import { userInfo } from 'os';

@Authorized()
@JsonController('/v1/reports')
export class ReportsController {
  private getReports = getReports;
  private getTestTypes = getTestTypes;

  @Get('/test-results')
  @UseBefore(hasPermission(VIEW_ADMIN_REPORTS))
  async getAllTestResultsTestTypeId(
    @QueryParam('testTypeId') testTypeId: string,
    @CurrentUser({ required: true }) actor: User,
    @Res() res: Response
  ) {
    const testType = await this.getTestTypes.byId(testTypeId);

    if (!testType) {
      throw new ApiError(404, apiErrorCodes.TEST_TYPE_NOT_FOUND);
    }

    const tests = await this.getReports.getTestResultsByTestTypeTestId(testType.id);

    log.info('Generated test report', {
      actorId: actor.id.value,
      testTypeId: testType.id.value,
    });

    const reportFileName = 'TestResultsReport_' + Date.now() + '.csv';

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${reportFileName}`);
    return writeToStream(res, transformReportTestResultsToReport(tests, testType));
  }
}
