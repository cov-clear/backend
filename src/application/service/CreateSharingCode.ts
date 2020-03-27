import { UserId } from '../../domain/model/user/UserId';
import { v4 as uuidv4 } from 'uuid';
import { SharingCode } from '../../domain/model/sharingCode/SharingCode';
import { SharingCodeRepository } from '../../domain/model/sharingCode/SharingCodeRepository';

export class CreateSharingCode {
  constructor(private sharingCodeRepository: SharingCodeRepository) {}

  public async withUserId(userId: string): Promise<SharingCode> {
    const sharingCode = new SharingCode(uuidv4(), new UserId(userId));
    return this.sharingCodeRepository.save(sharingCode);
  }
}
