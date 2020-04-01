import { v4 as uuidv4 } from 'uuid';
import { UserId } from '../user/UserId';

// 1 hour
const ACCESS_REQUEST_LIFETIME_MSEC = 60 * 60 * 1_000;

export class AccessPass {
  constructor(
    readonly actorUserId: UserId,
    readonly subjectUserId: UserId,
    readonly id: string = uuidv4(),
    readonly creationTime: Date = new Date()
  ) {}

  public isExpired(): boolean {
    return Date.now() > this.expirationTime().getTime();
  }

  public expirationTime(): Date {
    return new Date(this.creationTime.getTime() + ACCESS_REQUEST_LIFETIME_MSEC);
  }
}
