import AsyncRouter from '../AsyncRouter';
import { Response } from 'express';

import { getReports, getTestTypes } from '../../application/service';

import { AuthenticatedRequest } from '../AuthenticatedRequest';

import { ApiError, apiErrorCodes } from '../ApiError';
import { transformReportTestResultsToReport } from '../transformers/reports/transformReportTestResultsToReport';
import { hasPermission } from '../../api/middleware/hasPermission';

import { writeToStream } from '@fast-csv/format';
import { VIEW_ADMIN_REPORTS } from '../../domain/model/authentication/Permissions';

export default () => {
  const route = new AsyncRouter();

  // Only used for data reporting/export in MVP. Very heavy query as database grows.
  route.get(
    '/reports/test-results',
    hasPermission(VIEW_ADMIN_REPORTS),
    async (req: AuthenticatedRequest, res: Response) => {
      const testTypeId = req.query.TestTypeId;
      const testType = await getTestTypes.byId(testTypeId);

      if (!testType) {
        throw new ApiError(404, apiErrorCodes.TEST_TYPE_NOT_FOUND);
      }

      const tests = await getReports.getTestResults(testType.id);

      const reportFileName = 'TestResultsReport_' + Date.now() + '.csv';
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename=${reportFileName}`);
      writeToStream(res, transformReportTestResultsToReport(tests, testType));
    }
  );

  return route.middleware();
};
