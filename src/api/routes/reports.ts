import AsyncRouter from '../AsyncRouter';
import { Response } from 'express';

import { accessManagerFactory, addResultsToTest, createTest, getTests, getTestTypes } from '../../application/service';

import { AuthenticatedRequest, getAuthenticationOrFail } from '../AuthenticatedRequest';
import { UserId } from '../../domain/model/user/UserId';

import { isAuthenticated } from '../middleware/isAuthenticated';
import { ApiError, apiErrorCodes } from '../ApiError';
import { DomainValidationError } from '../../domain/model/DomainValidationError';
import { ResourceNotFoundError } from '../../domain/model/ResourceNotFoundError';
import { AccessDeniedError } from '../../domain/model/AccessDeniedError';
import { TestResultsCommand } from '../interface';
import { TestNotFoundError } from '../../domain/model/test/TestNotFoundError';
import { transformTestToDTO } from '../transformers/test/transfromTestToDTO';
import { transformTestResultsToDTO } from '../transformers/test/transformTestResultsToDTO';
import { transformTestToReportDTO } from '../transformers/test/transformTestToReportDTO';
import { v4 } from 'uuid';

export default () => {
  const route = new AsyncRouter();

  // Only used for data reporting/export in MVP. Very heavy query as database grows.
  route.get('/reports/test-results', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    const testTypeId = req.query.TestTypeId;

    const testType = await getTestTypes.byId(testTypeId);
    if (!testType) {
      throw new ApiError(404, apiErrorCodes.TEST_TYPE_NOT_FOUND);
    }

    const secret = v4();

    const tests = await getTests.getAll(testType.id);
    return res.json(tests.map((test) => transformTestToReportDTO(test, secret))).status(200);
  });

  return route.middleware();
};
