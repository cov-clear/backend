import AsyncRouter from '../AsyncRouter';
import { Request, Response } from 'express';
import { createTestType, getTestTypes } from '../../application/service';
import { TestType } from '../../domain/model/testType/TestType';
import { TestType as ApiTestType } from '../interface';
import { getAuthenticationOrFail } from '../AuthenticatedRequest';
import { hasPermission } from '../middleware/hasPermission';
import { CREATE_TEST_TYPE } from '../../domain/model/authentication/Permissions';
import { ApiError, apiErrorCodes } from '../ApiError';
import { DomainValidationError } from '../../domain/model/DomainValidationError';
import { TestTypeNameAlreadyExists } from '../../domain/model/testType/TestTypeRepository';

export default () => {
  const route = new AsyncRouter();

  route.get('/test-types', async (req: Request, res: Response) => {
    const authentication = getAuthenticationOrFail(req);

    const testTypes = await getTestTypes.forPermissions(authentication.permissions);
    res.json(testTypes && testTypes.map(mapTestTypeToApiResponse)).status(200);
  });

  route.post('/test-types', hasPermission(CREATE_TEST_TYPE), async (req: Request, res: Response) => {
    try {
      const testType = await createTestType.execute(req.body);
      res.status(201).json(mapTestTypeToApiResponse(testType));
    } catch (error) {
      handleError(error);
    }
  });

  return route.middleware();
};

function handleError(error: Error) {
  if (error instanceof TestTypeNameAlreadyExists) {
    throw new ApiError(409, apiErrorCodes.TEST_TYPE_NAME_CONFLICT);
  }
  if (error instanceof DomainValidationError) {
    throw new ApiError(422, `test-type.invalid.${error.field}`, error.reason);
  }
  throw error;
}

function mapTestTypeToApiResponse(testType: TestType): ApiTestType {
  return {
    id: testType.id.value,
    name: testType.name,
    resultsSchema: testType.resultsSchema,
    neededPermissionToAddResults: testType.neededPermissionToAddResults,
  };
}
