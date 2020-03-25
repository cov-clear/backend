import { v4String } from 'uuid/interfaces';
import { Email } from './Email';

export class User {
  constructor(private _id: string, private _email: Email) {}

  public id() {
    return this._id;
  }

  public email() {
    return this._email;
  }
}
