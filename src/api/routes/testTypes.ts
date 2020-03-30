import AsyncRouter from '../AsyncRouter';
import { Request, Response } from 'express';
import { getTestTypes } from '../../application/service';
import { TestType } from '../../domain/model/testType/TestType';
import { TestType as ApiTestType } from '../interface';
import { getAuthenticationOrFail } from '../AuthenticatedRequest';

export default () => {
  const route = new AsyncRouter();

  route.get('/test-types', async (req: Request, res: Response) => {
    const authentication = getAuthenticationOrFail(req);

    const testTypes = await getTestTypes.forPermissions(
      authentication.permissions
    );
    res.json(testTypes && testTypes.map(mapTestTypeToApiResponse)).status(200);
  });

  return route.middleware();
};

function mapTestTypeToApiResponse(testType: TestType): ApiTestType {
  return {
    id: testType.id.value,
    name: testType.name,
    resultsSchema: testType.resultsSchema,
  };
}
