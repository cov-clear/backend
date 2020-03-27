import { UserId } from '../../domain/model/user/UserId';
import { SharingCodeRepository } from '../../domain/model/sharingCode/SharingCodeRepository';
import { SharingCode } from '../../domain/model/sharingCode/SharingCode';

export class GetSharingCode {
  constructor(private sharingCodeRepository: SharingCodeRepository) {}

  async byCode(code: string): Promise<SharingCode | null> {
    return this.sharingCodeRepository.findByCode(code);
  }
}
