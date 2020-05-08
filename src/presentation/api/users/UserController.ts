import { accessManagerFactory, getUser, updateUser, getExistingOrCreateNewUser } from '../../../application/service';

import { UserTransformer } from '../../transformers/UserTransformer';
import { UserId } from '../../../domain/model/user/UserId';

import { ApiError, apiErrorCodes } from '../../dtos/ApiError';
import { UserDTO, RestrictedUserDTO } from '../../dtos/users/UserDTO';

import {
  Authorized,
  Body,
  CurrentUser,
  Get,
  HttpCode,
  JsonController,
  Param,
  Patch,
  Post,
  UseAfter,
  UseBefore,
} from 'routing-controllers';
import { hasPermission } from '../../middleware/hasPermission';
import { CREATE_USERS } from '../../../domain/model/authentication/Permissions';
import { UserErrorHandler } from './UserErrorHandler';
import { User } from '../../../domain/model/user/User';
import { CreateUserCommand } from '../../commands/users/CreateUserCommand';
import { UpdateUserCommand } from '../../commands/users/UpdateUserCommand';

import { AuthenticationDetails } from '../../../domain/model/user/AuthenticationDetails';
import {
  AuthenticationMethod,
  fromString as authenticationMethodTypeFromString,
} from '../../../domain/model/user/AuthenticationMethod';
import { AuthenticationIdentifier } from '../../../domain/model/user/AuthenticationIdentifier';

import log from '../../../infrastructure/logging/logger';

@Authorized()
@JsonController('/v1/users')
@UseAfter(UserErrorHandler)
export class UserController {
  private userTransformer = new UserTransformer();
  private accessManagerFactory = accessManagerFactory;

  @Post('')
  @HttpCode(201)
  @UseBefore(hasPermission(CREATE_USERS))
  async createUser(
    @Body() createUserCommand: CreateUserCommand,
    @CurrentUser() actor?: User
  ): Promise<RestrictedUserDTO> {
    const authenticationMethodType = authenticationMethodTypeFromString(createUserCommand.authenticationDetails.method);

    const authenticationDetails = new AuthenticationDetails(
      new AuthenticationMethod(authenticationMethodType),
      new AuthenticationIdentifier(createUserCommand.authenticationDetails.identifier)
    );

    const user = await getExistingOrCreateNewUser.execute(authenticationDetails, actor);
    return this.userTransformer.toRestrictedUserDTO(user);
  }

  @Get('/:id')
  async getById(@Param('id') idValue: string, @CurrentUser({ required: true }) actor: User): Promise<UserDTO> {
    const id = new UserId(idValue);

    await this.validateCanGetUser(actor, id);

    const user = await getUser.byId(idValue);
    log.info('User viewed via id', { userId: user.id.value, actorId: actor.id.value });

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
    log.info('User updated', { userId: user.id.value, actorId: actor.id.value });
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
