import { SharingCode } from '../../domain/model/sharingCode/SharingCode';
import { SharingCodeDTO } from '../dtos/accessSharing';

export class SharingCodeTransformer {
  public toSharingCodeDTO(sharingCode: SharingCode): SharingCodeDTO {
    return {
      code: sharingCode.code,
      expiryTime: sharingCode.expirationTime(),
    };
  }
}
