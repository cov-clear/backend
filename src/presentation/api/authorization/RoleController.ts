import { assignRoleToUser, createRole, getRoles } from '../../../application/service';
import { hasPermission } from '../../middleware/hasPermission';
import { ASSIGN_ROLE_TO_USER, CREATE_NEW_ROLE, LIST_ROLES } from '../../../domain/model/authentication/Permissions';
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
import { RoleErrorHandler } from './RoleErrorHandler';
import { RoleTransformer } from '../../transformers/RoleTransformer';
import { User } from '../../../domain/model/user/User';
import log from '../../../infrastructure/logging/logger';

@Authorized()
@JsonController('/v1')
@UseAfter(RoleErrorHandler)
export class RoleController {
  private roleTransformer = new RoleTransformer();
  private getRoles = getRoles;
  private createRole = createRole;
  private assignRoleToUser = assignRoleToUser;

  @Get('/roles')
  @UseBefore(hasPermission(LIST_ROLES))
  async getAll(@CurrentUser({ required: true }) actor: User) {
    const roles = await this.getRoles.all();

    log.info('Listed roles', { actorId: actor.id.value });

    return roles.map(this.roleTransformer.toRoleDTO);
  }

  @Post('/roles')
  @HttpCode(201)
  @UseBefore(hasPermission(CREATE_NEW_ROLE))
  async createNew(@BodyParam('name') name: string, @CurrentUser({ required: true }) actor: User) {
    const role = await this.createRole.execute(name, actor);

    log.info('Created role', { role: role.name, actorId: actor.id.value });

    return this.roleTransformer.toRoleDTO(role);
  }

  @Post('/users/:userId/roles')
  @UseBefore(hasPermission(ASSIGN_ROLE_TO_USER))
  async assignToRole(
    @BodyParam('name') roleName: string,
    @Param('userId') userIdValue: string,
    @CurrentUser({ required: true }) actor: User
  ) {
    const role = await this.assignRoleToUser.execute(roleName, userIdValue, actor);

    log.info('Assigned role to user', { role: role.name, actorId: actor.id.value, userId: userIdValue });

    return this.roleTransformer.toRoleDTO(role);
  }
}
