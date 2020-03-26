import AsyncRouter from '../AsyncRouter';
import { Request, Response } from 'express';
import { getUser, getTestTypes } from '../../application/service';
import { ApiError } from '../ApiError';

export default () => {
  const route = new AsyncRouter();

  route.get('/users/:id/test-types', async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await getUser.byId(id);

    if (!user) {
      throw new ApiError(404, 'user.not-found');
    }

    const trusted = user.permissions && user.permissions.contains('trusted'); // Not sure how permissions will work
    const testTypes = await getTestTypes.byTrusted(trusted);

    res
      .json({
        id: testType.id.value,
        name: testType.name.value,
        resultsSchema: testType.resultsSchema, // How will this work?
      })
      .status(200);
  });

  return route.middleware();
};
