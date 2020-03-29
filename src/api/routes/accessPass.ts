import { Request, Response } from 'express';
import AsyncRouter from '../AsyncRouter';
import { createAccessPass } from '../../application/service';
import { User } from '../../domain/model/accessPass/AccessPass';

export default () => {
  const route = new AsyncRouter();

  route.post(
    '/users/:id/access-passes',
    async (req: Request, res: Response) => {
      const { id } = req.parmas;
      const { code } = req.body;

      const accessPass = await createAccessPass.withSharingCode(code, id);

      // TODO Handle expired code

      res
        .json({
          userId: accessPass.subjectUserId.value,
          expiryTime: accessPass.expirationTime(),
        })
        .status(200);
    }
  );

  return route.middleware();
};
