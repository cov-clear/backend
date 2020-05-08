import { Body, HttpCode, JsonController, Post, UseBefore, CurrentUser } from 'routing-controllers';

import { bulkCreateUsers } from '../../../application/service';
import { UserTransformer } from '../../transformers/UserTransformer';
import { hasPermission } from '../../middleware/hasPermission';
import { BULK_CREATE_USERS } from '../../../domain/model/authentication/Permissions';
import { UserDTO } from '../../dtos/users/UserDTO';
import { CreateUserCommand } from '../../commands/admin/CreateUserCommand';
import { User } from '../../../domain/model/user/User';

@JsonController('/v1/admin')
export class AdminController {
  @Post('/users')
  @HttpCode(201)
  @UseBefore(hasPermission(BULK_CREATE_USERS))
  async createBulkUsers(
    @Body() createUserCommands: CreateUserCommand[],
    @CurrentUser({ required: true }) actor: User
  ): Promise<Array<UserDTO>> {
    const users = await bulkCreateUsers.execute(createUserCommands, actor);
    const transformer = new UserTransformer();
    return users.map((user) => transformer.toUserDTO(user));
  }
}
