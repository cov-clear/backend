import { AccessPass } from './AccessPass';

export interface AccessPassRepository {
  save(accessPass: AccessPass): Promise<AccessPass>;
  findByUserIds(
    actorUserId: UserId,
    subjectUserId: UserId
  ): Promise<AccessPass | null>;
}
