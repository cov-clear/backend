import { Response } from 'express';
import { AuthenticatedRequest, getAuthenticationOrFail } from '../AuthenticatedRequest';
import AsyncRouter from '../AsyncRouter';
import { createAccessPass, getUser, accessManagerFactory } from '../../application/service';
import { ApiError } from '../ApiError';
import { UserId } from '../../domain/model/user/UserId';
import { AccessPassFailedError } from '../../application/service/CreateAccessPass';

export default () => {
  const route = new AsyncRouter();

  route.post('/users/:id/access-passes', async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { code } = req.body;

    if (!accessManagerFactory.forAuthentication(getAuthenticationOrFail(req)).isLoggedInAsUser(new UserId(id))) {
      throw new ApiError(404, 'user.not-found');
    }

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
        throw new ApiError(403, error.failureReason.toString());
      }
      throw error;
    }
  });

  return route.middleware();
};
