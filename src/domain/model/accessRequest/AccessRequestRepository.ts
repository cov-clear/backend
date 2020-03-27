import { AccessRequest } from './AccessRequest';

export interface AccessRequestRepository {
  save(accessRequest: AccessRequest): Promise<AccessRequest>;
}
