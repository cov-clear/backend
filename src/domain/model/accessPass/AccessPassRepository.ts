import { AccessPass } from './AccessPass';

export interface AccessPassRepository {
  save(accessPass: AccessPass): Promise<AccessPass>;
}
