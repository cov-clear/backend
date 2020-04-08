import { Response } from 'express';
import AsyncRouter from '../AsyncRouter';
import { assignPermissionToRole, createPermission, getPermissions } from '../../application/service';
import { AuthenticatedRequest, getAuthenticationOrFail } from '../AuthenticatedRequest';
import { AccessDeniedError } from '../../domain/model/AccessDeniedError';
import { ApiError, apiErrorCodes } from '../ApiError';
import { DomainValidationError } from '../../domain/model/DomainValidationError';
import { RoleNotFoundError } from '../../domain/model/authentication/RoleRepository';
import { Permission as ApiPermission } from '../interface';
import { Permission } from '../../domain/model/authentication/Permission';
import { hasPermission } from '../../presentation/middleware/hasPermission';
import {
  ASSIGN_PERMISSION_TO_ROLE,
  CREATE_NEW_PERMISSION,
  LIST_PERMISSIONS,
} from '../../domain/model/authentication/Permissions';
import { PermissionNotFoundError } from '../../domain/model/authentication/PermissionNotFoundError';

export default () => {
  const route = new AsyncRouter();

  route.get('/permissions', hasPermission(LIST_PERMISSIONS), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const roles = await getPermissions.all();
      res.status(200).json(roles.map(mapPermissionToApiPermission));
    } catch (error) {
      handleError(error);
    }
  });

  route.post('/permissions', hasPermission(CREATE_NEW_PERMISSION), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { name } = req.body;
      const permission = await createPermission.execute(name, getAuthenticationOrFail(req).user);
      res.status(201).json(mapPermissionToApiPermission(permission));
    } catch (error) {
      handleError(error);
    }
  });

  route.post(
    '/roles/:roleName/permissions',
    hasPermission(ASSIGN_PERMISSION_TO_ROLE),
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const { roleName } = req.params;
        const { name: permissionName } = req.body;
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

export function mapPermissionToApiPermission(permission: Permission): ApiPermission {
  return {
    name: permission.name,
  };
}

function handleError(error: Error) {
  if (error instanceof RoleNotFoundError) {
    throw new ApiError(404, apiErrorCodes.ROLE_NOT_FOUND);
  }
  if (error instanceof PermissionNotFoundError) {
    throw new ApiError(422, apiErrorCodes.PERMISSION_NOT_FOUND);
  }
  if (error instanceof AccessDeniedError) {
    throw new ApiError(403, apiErrorCodes.ACCESS_DENIED);
  }
  if (error instanceof DomainValidationError) {
    throw new ApiError(422, `role.invalid.${error.field}`);
  }
  throw error;
}
