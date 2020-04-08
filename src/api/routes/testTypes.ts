import AsyncRouter from '../AsyncRouter';
import { Request, Response } from 'express';
import { createTestType, getTestTypes, updateTestType } from '../../application/service';
import { getAuthenticationOrFail } from '../AuthenticatedRequest';
import { hasPermission } from '../../presentation/middleware/hasPermission';
import { CREATE_TEST_TYPE, UPDATE_TEST_TYPE } from '../../domain/model/authentication/Permissions';
import { ApiError, apiErrorCodes } from '../ApiError';
import { DomainValidationError } from '../../domain/model/DomainValidationError';
import { TestTypeNameAlreadyExists } from '../../domain/model/test/testType/TestTypeRepository';
import { transformTestTypeToDTO } from '../transformers/test/transformTestTypeToDTO';
import { UpdateTestTypeCommand } from '../interface';

export default () => {
  const route = new AsyncRouter();

  route.get('/test-types', async (req: Request, res: Response) => {
    const authentication = getAuthenticationOrFail(req);

    const testTypes = await getTestTypes.forPermissions(authentication.permissions);
    res.json(testTypes && testTypes.map(transformTestTypeToDTO)).status(200);
  });

  route.post('/test-types', hasPermission(CREATE_TEST_TYPE), async (req: Request, res: Response) => {
    try {
      const testType = await createTestType.execute(req.body);
      res.status(201).json(transformTestTypeToDTO(testType));
    } catch (error) {
      handleError(error);
    }
  });

  route.patch('/test-types/:id', hasPermission(UPDATE_TEST_TYPE), async (req: Request, res: Response) => {
    try {
      const { id: testTypeId } = req.params;
      const command = req.body as UpdateTestTypeCommand;

      const testType = await updateTestType.execute(testTypeId, command);
      res.status(200).json(transformTestTypeToDTO(testType));
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
