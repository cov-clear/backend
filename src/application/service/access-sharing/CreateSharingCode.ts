import { SharingCode } from '../../../domain/model/sharingCode/SharingCode';
import { SharingCodeRepository } from '../../../domain/model/sharingCode/SharingCodeRepository';
import { UserId } from '../../../domain/model/user/UserId';

export class CreateSharingCode {
  constructor(private sharingCodeRepository: SharingCodeRepository) {}

  public async withUserId(userId: string, accessDuration: number = 15): Promise<SharingCode> {
    const sharingCode = new SharingCode(new UserId(userId), accessDuration);
    return this.sharingCodeRepository.save(sharingCode);
  }
}
