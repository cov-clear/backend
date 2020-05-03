import { accessManagerFactory, getUser, updateUser, getExistingOrCreateNewUser } from '../../../application/service';

import { UserTransformer } from '../../transformers/UserTransformer';
import { UserId } from '../../../domain/model/user/UserId';
import { AuthenticationDetails } from '../../../domain/model/user/AuthenticationDetails';

import { ApiError, apiErrorCodes } from '../../dtos/ApiError';
import { UserDTO } from '../../dtos/users/UserDTO';

import { Authorized, Body, CurrentUser, Get, JsonController, Param, Patch, UseAfter } from 'routing-controllers';
import { UserErrorHandler } from './UserErrorHandler';
import { User } from '../../../domain/model/user/User';
import { CreateUserCommand, UpdateUserCommand } from '../../commands/users/UpdateUserCommand';

@Authorized()
@JsonController('/v1/users')
@UseAfter(UserErrorHandler)
export class UserController {
  private userTransformer = new UserTransformer();
  private accessManagerFactory = accessManagerFactory;

  @Post('')
  @HttpCode(201)
  @UseBefore(hasPermission(CREATE_USERS))
  async createUser(@Body() createUserCommand: CreateUserCommand): Promise<UserDTO> {
    const authenticationDetails = new AuthenticationDetails(createUserCommand.method, createUserCommand.identifier);

    const user = await getExistingOrCreateNewUser.execute(authenticationDetails);
    return this.userTransformer.toRestrictedUserDTO(user);
  }

  @Get('/:id')
  async getById(@Param('id') idValue: string, @CurrentUser({ required: true }) actor: User): Promise<UserDTO> {
    const id = new UserId(idValue);

    await this.validateCanGetUser(actor, id);

    const user = await getUser.byId(idValue);

    return this.userTransformer.toUserDTO(user);
  }

  @Patch('/:id')
  async updateProfileAndAddress(
    @Param('id') idValue: string,
    @Body() updateUserCommand: UpdateUserCommand,
    @CurrentUser({ required: true }) actor: User
  ): Promise<UserDTO> {
    const userId = new UserId(idValue);

    await this.validateCanUpdateUser(actor, userId);

    const user = await updateUser.execute(idValue, updateUserCommand);
    return this.userTransformer.toUserDTO(user);
  }

  private async validateCanUpdateUser(actor: User, userIdToBeAccessed: UserId) {
    const accessManager = this.accessManagerFactory.forAuthenticatedUser(actor);

    if (accessManager.isLoggedInAsUser(userIdToBeAccessed)) {
      return;
    }

    const hasAccessPass = await accessManager.hasAccessPassForUser(userIdToBeAccessed);
    if (hasAccessPass) {
      throw new ApiError(403, apiErrorCodes.ACCESS_DENIED);
    }
    throw new ApiError(404, apiErrorCodes.USER_NOT_FOUND);
  }

  private async validateCanGetUser(actor: User, userIdToBeAccessed: UserId) {
    const canAccessUser = await this.accessManagerFactory.forAuthenticatedUser(actor).canAccessUser(userIdToBeAccessed);

    if (!canAccessUser) {
      throw new ApiError(404, apiErrorCodes.USER_NOT_FOUND);
    }
  }
}
