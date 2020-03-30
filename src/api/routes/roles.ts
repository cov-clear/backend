import { Response } from 'express';
import AsyncRouter from '../AsyncRouter';
import {
  assignRoleToUser,
  createRole,
  getRoles,
} from '../../application/service';
import {
  AuthenticatedRequest,
  getAuthenticationOrFail,
} from '../AuthenticatedRequest';
import { AccessDeniedError } from '../../domain/model/AccessDeniedError';
import { ApiError, apiErrorCodes } from '../ApiError';
import { DomainValidationError } from '../../domain/model/DomainValidationError';
import { UserNotFoundError } from '../../domain/model/user/UserNotFoundError';
import { RoleNotFoundError } from '../../domain/model/authentication/RoleNotFoundError';
import { Role } from '../../domain/model/authentication/Role';
import { Role as ApiRole } from '../interface';
import { hasPermission } from '../middleware/hasPermission';
import {
  ASSIGN_ROLE_TO_USER,
  CREATE_NEW_ROLE,
  LIST_ROLES,
} from '../../domain/model/authentication/Permissions';

export default () => {
  const route = new AsyncRouter();

  route.post(
    '/users/:id/roles',
    hasPermission(ASSIGN_ROLE_TO_USER),
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const { name } = req.body;

      try {
        const role = await assignRoleToUser.execute(
          name,
          id,
          getAuthenticationOrFail(req).user
        );
        res.status(200).json(mapRoleToApiRole(role));
      } catch (error) {
        handleError(error);
      }
    }
  );

  route.post(
    '/roles',
    hasPermission(CREATE_NEW_ROLE),
    async (req: AuthenticatedRequest, res: Response) => {
      const { name } = req.body;

      try {
        const role = await createRole.execute(
          name,
          getAuthenticationOrFail(req).user
        );
        res.status(201).json(mapRoleToApiRole(role));
      } catch (error) {
        handleError(error);
      }
    }
  );

  route.get(
    '/roles',
    hasPermission(LIST_ROLES),
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const roles = await getRoles.all();
        res.status(200).json(roles.map(mapRoleToApiRole));
      } catch (error) {
        handleError(error);
      }
    }
  );
  return route.middleware();
};

export function mapRoleToApiRole(role: Role): ApiRole {
  return {
    name: role.name,
    permissions: role.permissions().map(({ name }) => name),
  };
}

function handleError(error: Error) {
  if (error instanceof UserNotFoundError) {
    throw new ApiError(404, apiErrorCodes.USER_NOT_FOUND);
  }
  if (error instanceof RoleNotFoundError) {
    throw new ApiError(422, apiErrorCodes.ROLE_NOT_FOUND);
  }
  if (error instanceof AccessDeniedError) {
    throw new ApiError(403, apiErrorCodes.ACCESS_DENIED);
  }
  if (error instanceof DomainValidationError) {
    throw new ApiError(422, `role.invalid.${error.field}`);
  }
  throw error;
}
