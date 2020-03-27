import { Response } from 'express';
import AsyncRouter from '../AsyncRouter';
import {
  accessManagerFactory,
  createSharingCode,
} from '../../application/service';
import { isAuthenticated } from '../middleware/isAuthenticated';
import { AuthenticatedRequest } from '../AuthenticatedRequest';
import { UserId } from '../../domain/model/user/UserId';
import { ApiError } from '../ApiError';

export default () => {
  const route = new AsyncRouter();

  route.post(
    '/users/:id/sharing-code',
    isAuthenticated,
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;

      if (
        !accessManagerFactory
          .forAuthentication(req.authentication)
          .isLoggedInAsUser(new UserId(id))
      ) {
        throw new ApiError(404, 'user.not-found');
      }

      const sharingCode = await createSharingCode.withUserId(id);

      res
        .json({
          code: sharingCode.code,
          expiryTime: sharingCode.expirationTime(),
        })
        .status(200);
    }
  );

  return route.middleware();
};
