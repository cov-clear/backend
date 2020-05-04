import { v4 as uuidv4 } from 'uuid';
import { UserId } from '../user/UserId';

// 5 minutes
const SHARING_CODE_LIFETIME_MSEC = 5 * 60 * 1_000;
const ACCESS_PASS_DURATION_MINUTES = 60;

export class SharingCode {
  constructor(
    readonly userId: UserId,
    readonly accessDuration: number = ACCESS_PASS_DURATION_MINUTES,
    readonly code: string = uuidv4(),
    readonly creationTime: Date = new Date()
  ) {}

  public isExpired(): boolean {
    return Date.now() > this.expirationTime().getTime();
  }

  public expirationTime(): Date {
    return new Date(this.creationTime.getTime() + SHARING_CODE_LIFETIME_MSEC);
  }
}
