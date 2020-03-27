import { v4 as uuidv4 } from 'uuid';
import { UserId } from '../user/UserId';

const SHARING_CODE_LIFETIME_MSEC = 60_000;

export class SharingCode {
  constructor(
    public code: string = uuidv4(),
    public userId: UserId,
    public creationTime: Date = new Date()
  ) {}

  public isExpired(): boolean {
    return Date.now() > this.expirationTime().getTime();
  }

  public expirationTime(): Date {
    return new Date(this.creationTime.getTime() + SHARING_CODE_LIFETIME_MSEC);
  }
}
