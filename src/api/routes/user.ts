import AsyncRouter from '../AsyncRouter';
import { Request, Response } from 'express';
import { getUser, updateUser } from '../../application/service';
import { ApiError } from '../ApiError';
import {
  Address as ApiAddress,
  Profile as ApiProfile,
  UpdateUserCommand,
  User as ApiUser,
} from '../interface';
import { UserNotFoundError } from '../../application/service/UpdateUser';
import { DomainValidationError } from '../../domain/model/DomainValidationError';
import { User } from '../../domain/model/user/User';
import logger from '../../logger';

export default () => {
  const route = new AsyncRouter();

  route.get('/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await getUser.byId(id);

    if (!user) {
      throw new ApiError(404, 'user.not-found');
    }

    res.json(mapUserToApiResponse(user)).status(200);
  });

  route.patch('/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const command = req.body as UpdateUserCommand;

    try {
      const user = await updateUser.execute(id, command);
      res.status(200).json(mapUserToApiResponse(user));
    } catch (error) {
      handleUserUpdateError(error);
    }
  });

  return route.middleware();
};

function mapUserToApiResponse(user: User): ApiUser {
  return {
    id: user.id.value,
    email: user.email.value,
    creationTime: user.creationTime,
    profile: user.profile as ApiProfile,
    address: user.address as ApiAddress,
  };
}

function handleUserUpdateError(error: Error) {
  logger.warn(error);
  if (error instanceof UserNotFoundError) {
    throw new ApiError(404, 'user.not-found');
  }
  if (error instanceof DomainValidationError) {
    throw new ApiError(422, `user.invalid.${error.field}`, error.reason);
  }
  throw error;
}
