import AsyncRouter from '../AsyncRouter';
import { Response } from 'express';
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
import { Address } from '../../domain/model/user/Address';
import { isAuthenticated } from '../middleware/isAuthenticated';
import { AuthenticatedRequest } from '../AuthenticatedRequest';
import { Profile } from '../../domain/model/user/Profile';

export default () => {
  const route = new AsyncRouter();

  route.get(
    '/users/:id',
    isAuthenticated,
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const user = await getUser.byId(id);

      if (!user) {
        throw new ApiError(404, 'user.not-found');
      }

      res.json(mapUserToApiUser(user)).status(200);
    }
  );

  route.patch(
    '/users/:id',
    isAuthenticated,
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const command = req.body as UpdateUserCommand;

      try {
        const user = await updateUser.execute(id, command);
        res.status(200).json(mapUserToApiUser(user));
      } catch (error) {
        handleUserUpdateError(error);
      }
    }
  );

  return route.middleware();
};

export function mapUserToApiUser(user: User): ApiUser {
  return {
    id: user.id.value,
    email: user.email.value,
    creationTime: user.creationTime,
    profile: mapProfileToApiProfile(user.profile),
    address: mapAddressToApiAddress(user.address),
  };
}

export function mapProfileToApiProfile(
  profile?: Profile
): ApiProfile | undefined {
  return profile
    ? {
        firstName: profile.firstName,
        lastName: profile.lastName,
        sex: profile.sex,
        dateOfBirth: profile.dateOfBirth.toString(),
      }
    : profile;
}

export function mapAddressToApiAddress(
  address?: Address
): ApiAddress | undefined {
  return address
    ? {
        address1: address.address1,
        address2: address.address2,
        countryCode: address.country.code,
        postcode: address.postcode,
        city: address.city,
        region: address.region,
      }
    : address;
}

function handleUserUpdateError(error: Error) {
  if (error instanceof UserNotFoundError) {
    throw new ApiError(404, 'user.not-found');
  }
  if (error instanceof DomainValidationError) {
    throw new ApiError(422, `user.invalid.${error.field}`, error.reason);
  }
  throw error;
}
