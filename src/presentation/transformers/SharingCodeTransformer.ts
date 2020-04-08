import { SharingCode } from '../../domain/model/sharingCode/SharingCode';
import { SharingCodeDTO } from '../dtos/access-sharing/SharingCodeDTO';

export class SharingCodeTransformer {
  public toSharingCodeDTO(sharingCode: SharingCode): SharingCodeDTO {
    return {
      code: sharingCode.code,
      expiryTime: sharingCode.expirationTime(),
    };
  }
}
