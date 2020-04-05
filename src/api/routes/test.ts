import AsyncRouter from '../AsyncRouter';
import { Response } from 'express';

import { accessManagerFactory, addResultsToTest, createTest, getTests } from '../../application/service';

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

export default () => {
  const route = new AsyncRouter();

  route.get('/users/:id/tests', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = new UserId(id);

    const canAccessUser = await accessManagerFactory
      .forAuthentication(getAuthenticationOrFail(req))
      .canAccessUser(userId);

    if (!canAccessUser) {
      throw new ApiError(404, apiErrorCodes.USER_NOT_FOUND);
    }

    const tests = await getTests.byUserId(id);

    return res.json(tests.map((test) => transformTestToDTO(test))).status(200);
  });

  route.post('/users/:id/tests', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const userId = new UserId(id);
    const authentication = getAuthenticationOrFail(req);
    const accessManager = accessManagerFactory.forAuthentication(authentication);

    const isLoggedInAsUser = accessManager.isLoggedInAsUser(userId);
    const hasAccessPassForUser = await accessManager.hasAccessPassForUser(userId);

    if (!isLoggedInAsUser && !hasAccessPassForUser) {
      throw new ApiError(404, apiErrorCodes.USER_NOT_FOUND);
    }

    try {
      const test = await createTest.execute(authentication.user, id, payload);

      return res.status(201).json(transformTestToDTO(test));
    } catch (error) {
      handleCreationError(error);
    }
  });

  route.get('/tests/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const test = await getTests.byId(id);
    return res.json(transformTestToDTO(test)).status(200);
  });

  route.patch('/tests/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    const { id: testIdValue } = req.params;
    const { results: resultsCommand }: { results: TestResultsCommand } = req.body;
    const authentication = getAuthenticationOrFail(req);
    try {
      const results = await addResultsToTest.execute(authentication.user, testIdValue, resultsCommand);
      res.status(200).json(transformTestResultsToDTO(results));
    } catch (error) {
      handAddResultError(error);
    }
  });

  return route.middleware();
};

function handleCreationError(error: Error) {
  if (error instanceof AccessDeniedError) {
    throw new ApiError(403, apiErrorCodes.ACCESS_DENIED);
  }
  if (error instanceof ResourceNotFoundError) {
    throw new ApiError(422, `${error.resourceName}.not-found`);
  }
  if (error instanceof DomainValidationError) {
    throw new ApiError(422, `invalid.test.${error.field}`, error.reason);
  }
  throw error;
}

function handAddResultError(error: Error) {
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
