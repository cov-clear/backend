import { UserId } from '../../domain/model/user/UserId';
import { AccessRequest } from '../../domain/model/accessRequest/AccessRequest';
import { AccessRequestRepository } from '../../domain/model/accessRequest/AccessRequestRepository';

export class CreateAccessRequest {
  constructor() {}

  public async withIdAndSharingCode(
    userId: string,
    code: string
  ): Promise<AccessRequest> {
    const accessRequest = new AccessRequest(new UserId(userId), code);
    // TODO we need to set up permissions for this user somehow.
    return accessRequest;
  }
}
