import { assignPermissionToRole, createPermission, getPermissions } from '../../../application/service';
import { AuthenticatedRequest, getAuthenticationOrFail } from '../../../api/AuthenticatedRequest';
import { hasPermission } from '../../middleware/hasPermission';
import {
  ASSIGN_PERMISSION_TO_ROLE,
  CREATE_NEW_PERMISSION,
  LIST_PERMISSIONS,
} from '../../../domain/model/authentication/Permissions';
import { BodyParam, Get, HttpCode, JsonController, Param, Post, Req, UseAfter, UseBefore } from 'routing-controllers';
import { PermissionErrorHandler } from './PermissionErrorHandler';
import { PermissionTransformer } from '../../transformers/PermissionTransformer';

@JsonController('/v1')
@UseAfter(PermissionErrorHandler)
export class PermissionController {
  private permissionTransformer = new PermissionTransformer();
  private getPermissions = getPermissions;
  private createPermission = createPermission;
  private assignPermissionToRole = assignPermissionToRole;

  @Get('/permissions')
  @UseBefore(hasPermission(LIST_PERMISSIONS))
  async getAll() {
    const permissions = await this.getPermissions.all();

    return permissions.map(this.permissionTransformer.toPermissionDTO);
  }

  @Post('/permissions')
  @HttpCode(201)
  @UseBefore(hasPermission(CREATE_NEW_PERMISSION))
  async createNew(@BodyParam('name') name: string, @Req() req: AuthenticatedRequest) {
    const authentication = getAuthenticationOrFail(req);

    const permission = await this.createPermission.execute(name, authentication.user);

    return this.permissionTransformer.toPermissionDTO(permission);
  }

  @Post('/roles/:roleName/permissions')
  @UseBefore(hasPermission(ASSIGN_PERMISSION_TO_ROLE))
  async assignToRole(
    @BodyParam('name') permissionName: string,
    @Param('roleName') roleName: string,
    @Req() req: AuthenticatedRequest
  ) {
    const authentication = getAuthenticationOrFail(req);

    const permission = await this.assignPermissionToRole.execute(permissionName, roleName, authentication.user);

    return this.permissionTransformer.toPermissionDTO(permission);
  }
}
