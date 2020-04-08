import { AuthenticatedRequest, getAuthenticationOrFail } from '../../../api/AuthenticatedRequest';
import { accessManagerFactory, createSharingCode } from '../../../application/service';
import { ApiError, apiErrorCodes } from '../../../api/ApiError';
import { UserId } from '../../../domain/model/user/UserId';
import { Authentication } from '../../../domain/model/authentication/Authentication';
import { JsonController, Param, Post, Req, UseBefore } from 'routing-controllers';
import { isAuthenticated } from '../../middleware/isAuthenticated';
import { SharingCodeTransformer } from '../../transformers/SharingCodeTransformer';

@JsonController('/v1/users/:userId/sharing-code')
@UseBefore(isAuthenticated)
export class SharingCodeController {
  private sharingCodeTransformer = new SharingCodeTransformer();
  private createSharingCode = createSharingCode;
  private accessManagerFactory = accessManagerFactory;

  @Post('')
  async createNewAccessPass(@Param('userId') userIdValue: string, @Req() req: AuthenticatedRequest) {
    await this.ensureIsLoggedInAsUser(getAuthenticationOrFail(req), new UserId(userIdValue));

    const sharingCode = await this.createSharingCode.withUserId(userIdValue);

    return this.sharingCodeTransformer.toSharingCodeDTO(sharingCode);
  }

  private async ensureIsLoggedInAsUser(authentication: Authentication, userIdToBeAccessed: UserId) {
    if (!this.accessManagerFactory.forAuthentication(authentication).isLoggedInAsUser(userIdToBeAccessed)) {
      throw new ApiError(404, apiErrorCodes.USER_NOT_FOUND);
    }
  }
}
