import { Body, HttpCode, JsonController, Post, UseBefore } from 'routing-controllers';

import { bulkCreateUsers } from '../../../application/service';
import { UserTransformer } from '../../transformers/UserTransformer';
import { hasPermission } from '../../middleware/hasPermission';
import { BULK_CREATE_USERS } from '../../../domain/model/authentication/Permissions';
import { UserDTO } from '../../dtos/users/UserDTO';
import { CreateUserCommand } from '../../commands/admin/CreateUserCommand';

@JsonController('/v1/admin')
export class AdminController {
  @Post('/users')
  @HttpCode(201)
  @UseBefore(hasPermission(BULK_CREATE_USERS))
  async createBulkUsers(@Body() createUserCommands: CreateUserCommand[]): Promise<Array<UserDTO>> {
    const users = await bulkCreateUsers.execute(createUserCommands);
    const transformer = new UserTransformer();
    return users.map((user) => transformer.toUserDTO(user));
  }
}
