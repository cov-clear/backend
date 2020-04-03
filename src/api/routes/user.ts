import AsyncRouter from '../AsyncRouter';
import { Response } from 'express';

import { accessManagerFactory, getUser, updateUser } from '../../application/service';

import { AddressDTO, ProfileDTO, UserDTO } from '../../presentation/dtos/users';
import { UpdateUserCommand } from '../interface';
import { UserTransformer } from '../../presentation/transformers/users';

import { User } from '../../domain/model/user/User';
import { Address } from '../../domain/model/user/Address';
import { Profile } from '../../domain/model/user/Profile';
import { UserId } from '../../domain/model/user/UserId';

import { isAuthenticated } from '../middleware/isAuthenticated';
import { AuthenticatedRequest, getAuthenticationOrFail } from '../AuthenticatedRequest';

import { ApiError, apiErrorCodes } from '../ApiError';
import { DomainValidationError } from '../../domain/model/DomainValidationError';
import { ResourceNotFoundError } from '../../domain/model/ResourceNotFoundError';
import { UserNotFoundError } from '../../domain/model/user/UserRepository';

export default () => {
  const route = new AsyncRouter();

  route.get('/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const user = await getUser.byId(id);

    if (!user) {
      throw new ApiError(404, apiErrorCodes.USER_NOT_FOUND);
    }

    const canAccessUser = await accessManagerFactory
      .forAuthentication(getAuthenticationOrFail(req))
      .canAccessUser(user.id);

    if (!canAccessUser) {
      throw new ApiError(404, apiErrorCodes.USER_NOT_FOUND);
    }

    res.json(new UserTransformer().toUserDTO(user)).status(200);
  });

  route.patch('/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const command = req.body as UpdateUserCommand;

    const userId = new UserId(id);

    const isLoggedInAsUser = accessManagerFactory
      .forAuthentication(getAuthenticationOrFail(req))
      .isLoggedInAsUser(userId);

    const hasAccessPassForUser = await accessManagerFactory
      .forAuthentication(getAuthenticationOrFail(req))
      .hasAccessPassForUser(userId);

    if (!isLoggedInAsUser) {
      if (hasAccessPassForUser) {
        throw new ApiError(403, apiErrorCodes.ACCESS_DENIED);
      }
      throw new ApiError(404, apiErrorCodes.USER_NOT_FOUND);
    }

    try {
      const user = await updateUser.execute(id, command);
      res.status(200).json(new UserTransformer().toUserDTO(user));
    } catch (error) {
      handleUserUpdateError(error);
    }
  });

  return route.middleware();
};

function handleUserUpdateError(error: Error) {
  if (error instanceof UserNotFoundError) {
    throw new ApiError(422, apiErrorCodes.USER_NOT_FOUND);
  }
  if (error instanceof ResourceNotFoundError) {
    throw new ApiError(422, `${error.resourceName}.not-found`);
  }
  if (error instanceof DomainValidationError) {
    throw new ApiError(422, `user.invalid.${error.field}`, error.reason);
  }
  throw error;
}
