import { Response } from 'express';
import AsyncRouter from '../AsyncRouter';
import {
  accessManagerFactory,
  createSharingCode,
} from '../../application/service';
import { isAuthenticated } from '../middleware/isAuthenticated';
import {
  AuthenticatedRequest,
  getAuthenticationOrFail,
} from '../AuthenticatedRequest';
import { UserId } from '../../domain/model/user/UserId';
import { ApiError, apiErrorCodes } from '../ApiError';

export default () => {
  const route = new AsyncRouter();

  route.post(
    '/users/:id/sharing-code',
    isAuthenticated,
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;

      if (
        !accessManagerFactory
          .forAuthentication(getAuthenticationOrFail(req))
          .isLoggedInAsUser(new UserId(id))
      ) {
        throw new ApiError(404, apiErrorCodes.USER_NOT_FOUND);
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
