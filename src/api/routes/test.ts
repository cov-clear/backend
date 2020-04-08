import AsyncRouter from '../AsyncRouter';
import { Response } from 'express';

import { accessManagerFactory, addResultsToTest, createTest, getTests } from '../../application/service';

import { AuthenticatedRequest, getAuthenticationOrFail } from '../AuthenticatedRequest';
import { UserId } from '../../domain/model/user/UserId';

import { isAuthenticated } from '../../presentation/middleware/isAuthenticated';
import { ApiError, apiErrorCodes } from '../ApiError';
import { DomainValidationError } from '../../domain/model/DomainValidationError';
import { ResourceNotFoundError } from '../../domain/model/ResourceNotFoundError';
import { AccessDeniedError } from '../../domain/model/AccessDeniedError';
import { TestResultsCommand } from '../interface';
import { TestNotFoundError } from '../../domain/model/test/TestNotFoundError';
import { transformTestToDTO } from '../transformers/test/transfromTestToDTO';
import { transformTestResultsToDTO } from '../transformers/test/transformTestResultsToDTO';
import { Authentication } from '../../domain/model/authentication/Authentication';

export default () => {
  const route = new AsyncRouter();

  route.get('/users/:id/tests', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = new UserId(id);

      await validateCanAccessUser(getAuthenticationOrFail(req), userId);

      const tests = await getTests.byUserId(id);

      return res.json(tests.map((test) => transformTestToDTO(test))).status(200);
    } catch (error) {
      handleError(error);
    }
  });

  route.post('/users/:id/tests', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const payload = req.body;
      const userId = new UserId(id);
      const authentication = getAuthenticationOrFail(req);

      await validateCanAccessUser(authentication, userId);

      const test = await createTest.execute(authentication.user, id, payload);

      return res.status(201).json(transformTestToDTO(test));
    } catch (error) {
      handleError(error);
    }
  });

  route.get('/tests/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;

      const test = await getTests.byId(id);
      return res.json(transformTestToDTO(test)).status(200);
    } catch (error) {
      handleError(error);
    }
  });

  route.patch('/tests/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id: testIdValue } = req.params;
      const { results: resultsCommand }: { results: TestResultsCommand } = req.body;
      const authentication = getAuthenticationOrFail(req);

      const results = await addResultsToTest.execute(authentication.user, testIdValue, resultsCommand);
      res.status(200).json(transformTestResultsToDTO(results));
    } catch (error) {
      handleError(error);
    }
  });

  async function validateCanAccessUser(authentication: Authentication, userIdToBeAccessed: UserId) {
    const canAccessUser = await accessManagerFactory
      .forAuthentication(authentication)
      .canAccessUser(userIdToBeAccessed);

    if (!canAccessUser) {
      throw new ApiError(404, apiErrorCodes.USER_NOT_FOUND);
    }
  }

  return route.middleware();
};

function handleError(error: Error) {
  if (error instanceof TestNotFoundError) {
    throw new ApiError(404, apiErrorCodes.TEST_NOT_FOUND);
  }
  if (error instanceof AccessDeniedError) {
    throw new ApiError(403, apiErrorCodes.ACCESS_DENIED);
  }
  if (error instanceof ResourceNotFoundError) {
    throw new ApiError(422, `${error.resourceName}.not-found`);
  }
  if (error instanceof DomainValidationError) {
    throw new ApiError(422, `invalid.${error.field}`, error.reason);
  }
  throw error;
}
