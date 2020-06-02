import { AccessPass } from './AccessPass';
import { UserId } from '../user/UserId';

export interface AccessPassRepository {
  save(accessPass: AccessPass): Promise<AccessPass>;

  getTotalAmountOfAccessPasses(): Promise<number>;

  findByUserIds(actorUserId: UserId, subjectUserId: UserId): Promise<AccessPass | null>;
}
