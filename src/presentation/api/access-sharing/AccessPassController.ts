import { createAccessPass } from '../../../application/service';
import { ApiError, apiErrorCodes } from '../../dtos/ApiError';
import { UserId } from '../../../domain/model/user/UserId';
import { Authorized, BodyParam, CurrentUser, JsonController, Param, Post, UseAfter } from 'routing-controllers';
import { AccessPassTransformer } from '../../transformers/AccessPassTransformer';
import { AccessPassErrorHandler } from './AccessPassErrorHandler';
import { User } from '../../../domain/model/user/User';
import log from '../../../infrastructure/logging/logger';

@Authorized()
@JsonController('/v1/users/:userId/access-passes')
@UseAfter(AccessPassErrorHandler)
export class AccessPassController {
  private accessPassTransformer = new AccessPassTransformer();

  @Post('')
  async createNewAccessPass(
    @Param('userId') userIdValue: string,
    @BodyParam('code') sharingCode: string,
    @CurrentUser({ required: true }) actor: User
  ) {
    await this.ensureIsLoggedInAsUser(actor, new UserId(userIdValue));

    const accessPass = await createAccessPass.withSharingCode(sharingCode, userIdValue);

    log.info('Created access pass', {
      // Sharing code is sensitive info even though it's temporary and single-use, only showing the start of it for matching with other logs.
      sharingCodeStart: sharingCode.substring(4),
      accessPassId: accessPass.id,
      userId: accessPass.subjectUserId.value,
      actorId: accessPass.actorUserId.value,
    });

    return this.accessPassTransformer.toAccessPassDTO(accessPass);
  }

  private async ensureIsLoggedInAsUser(actor: User, userIdToBeAccessed: UserId) {
    if (!actor.id.equals(userIdToBeAccessed)) {
      throw new ApiError(404, apiErrorCodes.USER_NOT_FOUND);
    }
  }
}
