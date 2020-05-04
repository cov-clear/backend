import { v4 as uuidv4 } from 'uuid';
import { UserId } from '../user/UserId';

const DEFAULT_DURATION_MINUTES = 60;

export class AccessPass {
  constructor(
    readonly actorUserId: UserId,
    readonly subjectUserId: UserId,
    readonly duration: number = DEFAULT_DURATION_MINUTES,
    readonly id: string = uuidv4(),
    readonly creationTime: Date = new Date()
  ) {}

  public isExpired(): boolean {
    return Date.now() > this.expirationTime().getTime();
  }

  public expirationTime(): Date {
    const millisecondDuration = this.duration * 60 * 1_000;
    return new Date(this.creationTime.getTime() + millisecondDuration);
  }
}
