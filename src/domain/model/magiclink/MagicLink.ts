import { Email } from '../user/Email';
import { Uuid } from '../../Uuid';

// 1 hour
const MAGIC_LINK_LIFETIME_MSEC = 60 * 60 * 1_000;

export class MagicLink {
  constructor(
    readonly code: MagicLinkCode = new MagicLinkCode(),
    readonly email: Email,
    public active: boolean = true,
    readonly creationTime: Date = new Date()
  ) {}

  public isExpired(): boolean {
    return Date.now() > this.expirationTime().getTime();
  }

  public expirationTime(): Date {
    return new Date(this.creationTime.getTime() + MAGIC_LINK_LIFETIME_MSEC);
  }
}

export class MagicLinkCode extends Uuid {}
