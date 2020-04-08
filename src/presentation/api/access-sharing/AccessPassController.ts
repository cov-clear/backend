import { AuthenticatedRequest, getAuthenticationOrFail } from '../../../api/AuthenticatedRequest';
import { accessManagerFactory, createAccessPass } from '../../../application/service';
import { ApiError, apiErrorCodes } from '../../dtos/ApiError';
import { UserId } from '../../../domain/model/user/UserId';
import { Authentication } from '../../../domain/model/authentication/Authentication';
import { BodyParam, JsonController, Param, Post, Req, UseAfter, UseBefore } from 'routing-controllers';
import { isAuthenticated } from '../../middleware/isAuthenticated';
import { AccessPassTransformer } from '../../transformers/AccessPassTransformer';
import { AccessPassErrorHandler } from './AccessPassErrorHandler';

@JsonController('/v1/users/:userId/access-passes')
@UseBefore(isAuthenticated)
@UseAfter(AccessPassErrorHandler)
export class AccessPassController {
  private accessPassTransformer = new AccessPassTransformer();
  private accessManagerFactory = accessManagerFactory;

  @Post('')
  async createNewAccessPass(
    @Param('userId') userIdValue: string,
    @BodyParam('code') sharingCode: string,
    @Req() req: AuthenticatedRequest
  ) {
    await this.ensureIsLoggedInAsUser(getAuthenticationOrFail(req), new UserId(userIdValue));

    const accessPass = await createAccessPass.withSharingCode(sharingCode, userIdValue);

    return this.accessPassTransformer.toAccessPassDTO(accessPass);
  }

  private async ensureIsLoggedInAsUser(authentication: Authentication, userIdToBeAccessed: UserId) {
    if (!this.accessManagerFactory.forAuthentication(authentication).isLoggedInAsUser(userIdToBeAccessed)) {
      throw new ApiError(404, apiErrorCodes.USER_NOT_FOUND);
    }
  }
}
