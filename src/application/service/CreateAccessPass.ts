import { UserId } from '../../domain/model/user/UserId';
import { AccessPass } from '../../domain/model/accessPass/AccessPass';
import { AccessPassRepository } from '../../domain/model/accessPass/AccessPassRepository';
import { SharingCodeRepository } from '../../domain/model/sharingCode/SharingCodeRepository';

export class CreateAccessPass {
  constructor(
    private accessPassRepository: AccessPassRepository,
    private sharingCodeRepository: SharingCodeRepository
  ) {}

  public async withSharingCode(
    code: string,
    userId: string
  ): Promise<AccessPass> {
    const sharingCode = await sharingCodeRepository.findByCode(code);

    if (sharingCode.isExpired()) {
      throw new AccessPassFailedError(
        AccessPassFailureReason.SHARING_CODE_EXPIRED
      );
    }

    const accessPass = new AccessPass(new UserId(userId), sharingCode.userId);

    return this.accessPassRepository.save(accessPass);
  }
}

export class AccessPassFailedError extends Error {
  constructor(public failureReason: AccessPassFailureReason) {
    super(`Failed to create access pass ${failureReason}`);
  }
}

export enum AccessPassFailureReason {
  SHARING_CODE_EXPIRED = 'SHARING_CODE_EXPIRED',
}
