import AsyncRouter from '../AsyncRouter';
import { Request, Response } from 'express';
import { getUser } from '../../application/service';
import { ApiError } from '../ApiError';

export default () => {
  const route = new AsyncRouter();

  route.get(
    '/users/:id',
    async (req: Request, res: Response, next: (...things: any[]) => any) => {
      const { id } = req.params;

      const user = await getUser.byId(id);

      if (!user) {
        next(new ApiError(404, 'user.not-found'));
        return;
      }

      res
        .json({
          id: user.id().value(),
          email: user.email().value(),
          creationTime: user.creationTime(),
        })
        .status(200);
    }
  );

  return route.middleware();
};
