import AsyncRouter from '../AsyncRouter';
import { Response } from 'express';
import {
  createOrUpdateTest,
  getUser,
  getTests,
} from '../../application/service';
import { ApiError } from '../ApiError';
import { User } from '../../domain/model/user/User';
//import {Test as ApiTest} from '../interface/index';
import { Test } from '../../domain/model/test/Test';

import logger from '../../logger';
import { isAuthenticated } from '../middleware/isAuthenticated';
import { AuthenticatedRequest } from '../AuthenticatedRequest';

export default () => {
  const route = new AsyncRouter();

  route.get(
    '/users/:id/tests',
    isAuthenticated,
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const user = await getUser.byId(id);

      if (!user) {
        throw new ApiError(404, 'user.not-found');
      }

      const tests = await getTests.byUserId(id);

      return res
        .json(tests.map((test: any) => mapTestToApiTest(test)))
        .status(200);
    }
  );

  route.get(
    '/tests/:id',
    isAuthenticated,
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;

      const test = await getTests.byId(id);
      return res.json(mapTestToApiTest(test)).status(200);
    }
  );

  route.post(
    '/users/:id/tests',
    isAuthenticated,
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const payload = req.body;

      const user = await getUser.byId(id);

      if (!user) {
        throw new ApiError(404, 'user-not-found - userId - ' + id);
      }

      const test = await createOrUpdateTest.execute(id, payload);
      return res.status(200).json(mapTestToApiTest(test));
    }
  );

  // TODO: implement patch to update results later if needed.
  /*
  route.patch(
    '/tests/:id',
    isAuthenticated,
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const payload = req.body;
  );*/

  return route.middleware();
};

export function mapTestToApiTest(test: Test | null) {
  if (!test) {
    return null;
  }

  return {
    id: test.id.value,
    userId: test.userId.value,
    testTypeId: test.testTypeId.value,
    creationTime: test.creationTime,
  };
}
