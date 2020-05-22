import { AccessPass } from './AccessPass';
import { UserId } from '../user/UserId';

export interface AccessPassRepository {
  save(accessPass: AccessPass): Promise<AccessPass>;

  findByUserIds(actorUserId: UserId, subjectUserId: UserId): Promise<AccessPass | null>;

  findByActorId(actorUserId: UserId): Promise<Array<AccessPass>>;
}
