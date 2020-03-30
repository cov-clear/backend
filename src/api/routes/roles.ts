import { Response } from 'express';
import AsyncRouter from '../AsyncRouter';
import {
  assignPermissionToRole,
  assignRoleToUser,
  createPermission,
  createRole,
} from '../../application/service';
import { isAuthenticated } from '../middleware/isAuthenticated';
import {
  AuthenticatedRequest,
  getAuthenticationOrFail,
} from '../AuthenticatedRequest';
import { AccessDeniedError } from '../../domain/model/AccessDeniedError';
import { ApiError } from '../ApiError';
import { DomainValidationError } from '../../domain/model/DomainValidationError';
import { UserNotFoundError } from '../../domain/model/user/UserNotFoundError';
import { RoleNotFoundError } from '../../domain/model/authentication/RoleNotFoundError';
import { Role } from '../../domain/model/authentication/Role';
import { Permission as ApiPermission, Role as ApiRole } from '../interface';
import { Permission } from '../../domain/model/authentication/Permission';
import { hasPermission } from '../middleware/hasPermission';
import { ASSIGN_ROLE_TO_USER } from '../../domain/model/authentication/Permissions';

export default () => {
  const route = new AsyncRouter();

  route.post(
    '/users/:id/roles',
    isAuthenticated,
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
    isAuthenticated,
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

  route.post(
    '/permissions',
    isAuthenticated,
    async (req: AuthenticatedRequest, res: Response) => {
      const { name } = req.body;

      try {
        const permission = await createPermission.execute(
          name,
          getAuthenticationOrFail(req).user
        );
        res.status(201).json(mapPermissionToApiPermission(permission));
      } catch (error) {
        handleError(error);
      }
    }
  );

  route.post(
    '/roles/:roleName/permissions',
    isAuthenticated,
    async (req: AuthenticatedRequest, res: Response) => {
      const { roleName } = req.params;
      const { name: permissionName } = req.body;

      try {
        const permission = await assignPermissionToRole.execute(
          permissionName,
          roleName,
          getAuthenticationOrFail(req).user
        );
        res.status(200).json(mapPermissionToApiPermission(permission));
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

export function mapPermissionToApiPermission(
  permission: Permission
): ApiPermission {
  return {
    name: permission.name,
  };
}

function handleError(error: Error) {
  if (error instanceof UserNotFoundError) {
    throw new ApiError(404, 'user.not-found');
  }
  if (error instanceof RoleNotFoundError) {
    throw new ApiError(404, 'role.not-found');
  }
  if (error instanceof AccessDeniedError) {
    throw new ApiError(403, 'access.denied');
  }
  if (error instanceof DomainValidationError) {
    throw new ApiError(422, `role.invalid.${error.field}`);
  }
  throw error;
}
