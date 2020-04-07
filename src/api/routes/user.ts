import AsyncRouter from '../AsyncRouter';
import { Response } from 'express';

import { accessManagerFactory, getUser, updateUser } from '../../application/service';
import { UserTransformer } from '../../presentation/transformers/users';
import { UserId } from '../../domain/model/user/UserId';

import { isAuthenticated } from '../middleware/isAuthenticated';
import { AuthenticatedRequest, getAuthenticationOrFail } from '../AuthenticatedRequest';

import { ApiError, apiErrorCodes } from '../ApiError';
import { DomainValidationError } from '../../domain/model/DomainValidationError';
import { ResourceNotFoundError } from '../../domain/model/ResourceNotFoundError';
import { UserNotFoundError } from '../../domain/model/user/UserRepository';
import { UpdateUserCommand } from '../../presentation/commands/users';
import { AccessDeniedError } from '../../domain/model/AccessDeniedError';
import { Authentication } from '../../domain/model/authentication/Authentication';

export default () => {
  const route = new AsyncRouter();

  route.get('/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;

      await validateCanGetUser(getAuthenticationOrFail(req), new UserId(id));

      const user = await getUser.byId(id);

      res.json(new UserTransformer().toUserDTO(user)).status(200);
    } catch (error) {
      handleError(error);
    }
  });

  route.patch('/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const command = req.body as UpdateUserCommand;
      const userId = new UserId(id);

      await validateCanUpdateUser(getAuthenticationOrFail(req), userId);

      const user = await updateUser.execute(id, command);
      res.status(200).json(new UserTransformer().toUserDTO(user));
    } catch (error) {
      handleError(error);
    }
  });

  async function validateCanUpdateUser(authentication: Authentication, userIdToBeAccessed: UserId) {
    const accessManager = accessManagerFactory.forAuthentication(authentication);

    if (accessManager.isLoggedInAsUser(userIdToBeAccessed)) {
      return;
    }

    const hasAccessPass = await accessManager.hasAccessPassForUser(userIdToBeAccessed);
    if (hasAccessPass) {
      throw new ApiError(403, apiErrorCodes.ACCESS_DENIED);
    }
    throw new ApiError(404, apiErrorCodes.USER_NOT_FOUND);
  }

  async function validateCanGetUser(authentication: Authentication, userIdToBeAccessed: UserId) {
    const canAccessUser = await accessManagerFactory
      .forAuthentication(authentication)
      .canAccessUser(userIdToBeAccessed);

    if (!canAccessUser) {
      throw new ApiError(404, apiErrorCodes.USER_NOT_FOUND);
    }
  }

  return route.middleware();
};

function handleError(error: Error) {
  if (error instanceof UserNotFoundError) {
    throw new ApiError(404, apiErrorCodes.USER_NOT_FOUND);
  }
  if (error instanceof AccessDeniedError) {
    throw new ApiError(403, apiErrorCodes.ACCESS_DENIED);
  }
  if (error instanceof ResourceNotFoundError) {
    throw new ApiError(422, `${error.resourceName}.not-found`);
  }
  if (error instanceof DomainValidationError) {
    throw new ApiError(422, `user.invalid.${error.field}`, error.reason);
  }
  throw error;
}
