import { Request, Response } from 'express';
import AsyncRouter from '../AsyncRouter';
import { createAccessPass } from '../../application/service';
import { User } from '../../domain/model/accessPass/AccessPass';
import { AccessPassFailedError } from '../../application/service/CreateAccessPass';

export default () => {
  const route = new AsyncRouter();

  route.post(
    '/users/:id/access-passes',
    async (req: Request, res: Response) => {
      const { id } = req.parmas;
      const { code } = req.body;

      try {
        const accessPass = await createAccessPass.withSharingCode(code, id);
        res
          .json({
            userId: accessPass.subjectUserId.value,
            expiryTime: accessPass.expirationTime(),
          })
          .status(200);
      } catch (error) {
        if (error instanceof AccessPassFailedError) {
          res.status(403).json({
            code: error.failureReason.toString(),
          });
          return;
        }
        throw error;
      }
    }
  );

  return route.middleware();
};
