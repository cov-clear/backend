import { accessManagerFactory, getUser, updateUser } from '../../../application/service';
import { UserTransformer } from '../../transformers/UserTransformer';
import { UserId } from '../../../domain/model/user/UserId';

import { isAuthenticated } from '../../middleware/isAuthenticated';
import { AuthenticatedRequest, getAuthenticationOrFail } from '../../../api/AuthenticatedRequest';

import { ApiError, apiErrorCodes } from '../../dtos/ApiError';
import { UpdateUserCommand } from '../../commands/users';
import { Authentication } from '../../../domain/model/authentication/Authentication';
import { Body, Get, JsonController, Param, Patch, Req, UseAfter, UseBefore } from 'routing-controllers';
import { UserErrorHandler } from './UserErrorHandler';

@JsonController('/v1/users')
@UseBefore(isAuthenticated)
@UseAfter(UserErrorHandler)
export class UserController {
  private userTransformer = new UserTransformer();
  private accessManagerFactory = accessManagerFactory;

  @Get('/:id')
  async getById(@Param('id') idValue: string, @Req() req: AuthenticatedRequest) {
    const id = new UserId(idValue);

    await this.validateCanGetUser(getAuthenticationOrFail(req), id);

    const user = await getUser.byId(idValue);

    return this.userTransformer.toUserDTO(user);
  }

  @Patch('/:id')
  async updateProfileAndAddress(
    @Param('id') idValue: string,
    @Body() updateUserCommand: UpdateUserCommand,
    @Req() req: AuthenticatedRequest
  ) {
    const userId = new UserId(idValue);

    await this.validateCanUpdateUser(getAuthenticationOrFail(req), userId);

    const user = await updateUser.execute(idValue, updateUserCommand);
    return this.userTransformer.toUserDTO(user);
  }

  private async validateCanUpdateUser(authentication: Authentication, userIdToBeAccessed: UserId) {
    const accessManager = this.accessManagerFactory.forAuthentication(authentication);

    if (accessManager.isLoggedInAsUser(userIdToBeAccessed)) {
      return;
    }

    const hasAccessPass = await accessManager.hasAccessPassForUser(userIdToBeAccessed);
    if (hasAccessPass) {
      throw new ApiError(403, apiErrorCodes.ACCESS_DENIED);
    }
    throw new ApiError(404, apiErrorCodes.USER_NOT_FOUND);
  }

  private async validateCanGetUser(authentication: Authentication, userIdToBeAccessed: UserId) {
    const canAccessUser = await this.accessManagerFactory
      .forAuthentication(authentication)
      .canAccessUser(userIdToBeAccessed);

    if (!canAccessUser) {
      throw new ApiError(404, apiErrorCodes.USER_NOT_FOUND);
    }
  }
}
