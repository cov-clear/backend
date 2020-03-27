import AsyncRouter from '../AsyncRouter';
import { Request, Response } from 'express';
import { getTestTypes } from '../../application/service';
import { TestType } from '../../domain/model/testType/TestType';
import { ApiError } from '../ApiError';

export default () => {
  const route = new AsyncRouter();

  route.get('/users/:id/test-types', async (req: Request, res: Response) => {
    const { id } = req.params;

    // const user = await getUser.byId(id);
    //
    // if (!user) {
    //   throw new ApiError(404, "user.not-found");
    // }
    //
    // const trusted = user.permissions && user.permissions.contains("trusted"); // Not sure how permissions will work
    const trusted = true;

    const testTypes = await getTestTypes.byTrusted(trusted);

    res.json(testTypes.map(mapTestTypeToApiResponse)).status(200);
  });

  return route.middleware();
};

function mapTestTypeToApiResponse(testType: TestType) {
  return {
    id: testType.id.value,
    name: testType.name,
    resultsSchema: testType.resultsSchema,
  };
}
