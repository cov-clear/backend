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

export default () => {
  const route = new AsyncRouter();

  route.post(
    '/users/:id/roles',
    isAuthenticated,
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const { name } = req.body;

      try {
        await assignRoleToUser.execute(
          name,
          id,
          getAuthenticationOrFail(req).user
        );
        res.status(200).json({ name });
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
        res.status(201).json({ name: role.name });
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
        res.status(201).json({ name: permission.name });
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
        await assignPermissionToRole.execute(
          permissionName,
          roleName,
          getAuthenticationOrFail(req).user
        );
        res.status(200).json({ name: permissionName });
      } catch (error) {
        handleError(error);
      }
    }
  );

  return route.middleware();
};

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
