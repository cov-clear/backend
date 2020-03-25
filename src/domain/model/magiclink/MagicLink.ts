import { v4 as uuidv4 } from 'uuid';
import { Email } from '../user/Email';

const MAGIC_LINK_LIFETIME_MSEC = 5 * 60_000;

export class MagicLink {
  constructor(
    public id: string = uuidv4(),
    public email: Email,
    public code: string,
    public active: boolean = true,
    public creationTime: Date = new Date()
  ) {}

  public isExpired(): boolean {
    return Date.now() > this.expirationTime().getTime();
  }

  public expirationTime(): Date {
    return new Date(this.creationTime.getTime() + MAGIC_LINK_LIFETIME_MSEC);
  }
}
