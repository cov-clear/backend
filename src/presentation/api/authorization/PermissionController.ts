import { assignPermissionToRole, createPermission, getPermissions } from '../../../application/service';
import { hasPermission } from '../../middleware/hasPermission';
import {
  ASSIGN_PERMISSION_TO_ROLE,
  CREATE_NEW_PERMISSION,
  LIST_PERMISSIONS,
} from '../../../domain/model/authentication/Permissions';
import {
  Authorized,
  BodyParam,
  CurrentUser,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
  UseAfter,
  UseBefore,
} from 'routing-controllers';
import { PermissionErrorHandler } from './PermissionErrorHandler';
import { PermissionTransformer } from '../../transformers/PermissionTransformer';
import { User } from '../../../domain/model/user/User';
import log from '../../../infrastructure/logging/logger';

@Authorized()
@JsonController('/v1')
@UseAfter(PermissionErrorHandler)
export class PermissionController {
  private permissionTransformer = new PermissionTransformer();
  private getPermissions = getPermissions;
  private createPermission = createPermission;
  private assignPermissionToRole = assignPermissionToRole;

  @Get('/permissions')
  @UseBefore(hasPermission(LIST_PERMISSIONS))
  async getAll(@CurrentUser({ required: true }) actor: User) {
    const permissions = await this.getPermissions.all();

    log.info('Listed permissions', {
      actorId: actor.id.value,
    });

    return permissions.map(this.permissionTransformer.toPermissionDTO);
  }

  @Post('/permissions')
  @HttpCode(201)
  @UseBefore(hasPermission(CREATE_NEW_PERMISSION))
  async createNew(@BodyParam('name') name: string, @CurrentUser({ required: true }) actor: User) {
    const permission = await this.createPermission.execute(name, actor);

    log.info('Created permission', {
      actorId: actor.id.value,
      permission: permission.name,
    });

    return this.permissionTransformer.toPermissionDTO(permission);
  }

  @Post('/roles/:roleName/permissions')
  @UseBefore(hasPermission(ASSIGN_PERMISSION_TO_ROLE))
  async assignToRole(
    @BodyParam('name') permissionName: string,
    @Param('roleName') roleName: string,
    @CurrentUser({ required: true }) actor: User
  ) {
    const permission = await this.assignPermissionToRole.execute(permissionName, roleName, actor);

    log.info('Assigned permission to role', {
      actorId: actor.id.value,
      permission: permission.name,
      role: roleName,
    });

    return this.permissionTransformer.toPermissionDTO(permission);
  }
}
