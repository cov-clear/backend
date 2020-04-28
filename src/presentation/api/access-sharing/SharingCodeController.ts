import { createSharingCode } from '../../../application/service';
import { ApiError, apiErrorCodes } from '../../dtos/ApiError';
import { UserId } from '../../../domain/model/user/UserId';
import { Authorized, CurrentUser, JsonController, Param, Post } from 'routing-controllers';
import { SharingCodeTransformer } from '../../transformers/SharingCodeTransformer';
import { User } from '../../../domain/model/user/User';

@Authorized()
@JsonController('/v1/users/:userId/sharing-code')
export class SharingCodeController {
  private sharingCodeTransformer = new SharingCodeTransformer();
  private createSharingCode = createSharingCode;

  @Post('')
  async createNewAccessPass(
    @Param('userId') userIdValue: string,
    @Param('duration') duration: number,
    @CurrentUser({ required: true }) actor: User
  ) {
    await this.ensureIsLoggedInAsUser(actor, new UserId(userIdValue));

    const sharingCode = await this.createSharingCode.withUserId(userIdValue);

    return this.sharingCodeTransformer.toSharingCodeDTO(sharingCode);
  }

  private async ensureIsLoggedInAsUser(actor: User, userIdToBeAccessed: UserId) {
    if (!actor.id.equals(userIdToBeAccessed)) {
      throw new ApiError(404, apiErrorCodes.USER_NOT_FOUND);
    }
  }
}
