import { Response } from 'express';
import { AuthenticatedRequest, getAuthenticationOrFail } from '../AuthenticatedRequest';
import AsyncRouter from '../AsyncRouter';
import { accessManagerFactory, createAccessPass } from '../../application/service';
import { ApiError, apiErrorCodes } from '../ApiError';
import { UserId } from '../../domain/model/user/UserId';
import { AccessPassFailedError } from '../../application/service/access-sharing/CreateAccessPass';
import { DomainValidationError } from '../../domain/model/DomainValidationError';
import { Authentication } from '../../domain/model/authentication/Authentication';

export default () => {
  const route = new AsyncRouter();

  route.post('/users/:id/access-passes', async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { code } = req.body;
      await ensureIsLoggedInAsUser(getAuthenticationOrFail(req), new UserId(id));

      const accessPass = await createAccessPass.withSharingCode(code, id);

      res
        .json({
          userId: accessPass.subjectUserId.value,
          expiryTime: accessPass.expirationTime(),
        })
        .status(200);
    } catch (error) {
      handleError(error);
    }
  });

  return route.middleware();
};

async function ensureIsLoggedInAsUser(authentication: Authentication, userIdToBeAccessed: UserId) {
  if (!accessManagerFactory.forAuthentication(authentication).isLoggedInAsUser(userIdToBeAccessed)) {
    throw new ApiError(404, apiErrorCodes.USER_NOT_FOUND);
  }
}

function handleError(error: Error) {
  if (error instanceof AccessPassFailedError) {
    throw new ApiError(422, error.failureReason);
  }
  if (error instanceof DomainValidationError) {
    throw new ApiError(422, `invalid.${error.field}`, error.reason);
  }
  throw error;
}
