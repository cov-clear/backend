import { Email } from './Email';
import { UserId } from './UserId';

export class User {
  constructor(
    readonly id: UserId,
    readonly email: Email,
    readonly creationTime: Date = new Date()
  ) {}
}
