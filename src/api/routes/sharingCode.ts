import { Request, Response } from 'express';
import AsyncRouter from '../AsyncRouter';
import { getUser, createSharingCode } from '../../application/service';
import { User } from '../../domain/model/user/User';

export default () => {
  const route = new AsyncRouter();

  route.post('/users/:id/sharing-code', async (req: Request, res: Response) => {
    const { id } = req.params;

    // Check if this id belongs to the current user !!!!

    const sharingCode = await createSharingCode.withUserId(id);

    res
      .json({
        code: sharingCode.code,
        expiryTime: sharingCode.expirationTime(),
      })
      .status(200);
  });

  return route.middleware();
};
