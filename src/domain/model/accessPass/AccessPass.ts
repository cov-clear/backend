import { v4 as uuidv4 } from 'uuid';
import { UserId } from '../user/UserId';

const ACCESS_REQUEST_LIFETIME_MSEC = 60 * 60_000;

export class AccessPass {
  constructor(
    public actorUserId: UserId,
    public subjectUserId: UserId,
    public id: string = uuidv4(),
    public creationTime: Date = new Date()
  ) {}

  public isExpired(): boolean {
    return Date.now() > this.expirationTime().getTime();
  }

  public expirationTime(): Date {
    return new Date(this.creationTime.getTime() + ACCESS_REQUEST_LIFETIME_MSEC);
  }
}
