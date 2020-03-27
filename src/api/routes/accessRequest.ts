import { Request, Response } from 'express';
import AsyncRouter from '../AsyncRouter';
import { requestAccess } from '../../application/service';
import { User } from '../../domain/model/accessRequest/AccessRequest';

export default () => {
  const route = new AsyncRouter();

  route.post(
    '/users/:id/access-requests',
    async (req: Request, res: Response) => {
      const { id } = req.parmas;
      const { code } = req.body;

      const accessRequest = await requestAccess.withIdAndSharingCode(id, code);

      res
        .json({
          userId: accessRequest.userId.value,
          expiryTime: accessRequest.expirationTime(),
        })
        .status(200);
    }
  );

  return route.middleware();
};
