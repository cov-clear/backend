import { UserId } from '../../domain/model/user/UserId';
import { AccessRequest } from '../../domain/model/accessRequest/AccessRequest';
import { AccessRequestRepository } from '../../domain/model/accessRequest/AccessRequestRepository';

export class CreateAccessRequest {
  constructor(private accessRequestRepository: AccessRequestRepository) {}

  public async withIdAndSharingCode(
    userId: string,
    code: string
  ): Promise<AccessRequest> {
    const accessRequest = new AccessRequest(new UserId(userId), code);
    return this.accessRequestRepository.save(accessRequest);
  }
}
