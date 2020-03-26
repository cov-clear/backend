import { Email } from './Email';
import { UserId } from './UserId';

export class User {
  constructor(
    private _id: UserId,
    private _email: Email,
    private _creationTime: Date = new Date()
  ) {}

  public id() {
    return this._id;
  }

  public email() {
    return this._email;
  }

  public creationTime() {
    return this._creationTime;
  }
}
