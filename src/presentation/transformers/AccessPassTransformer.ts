import { AccessPass } from '../../domain/model/accessPass/AccessPass';
import { AccessPassDTO } from '../dtos/accessSharing';

export class AccessPassTransformer {
  public toAccessPassDTO(accessPass: AccessPass): AccessPassDTO {
    return {
      userId: accessPass.subjectUserId.value,
      expiryTime: accessPass.expirationTime(),
    };
  }
}
