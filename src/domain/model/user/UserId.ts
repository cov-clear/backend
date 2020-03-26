import { v4 } from 'uuid';

export class UserId {
  constructor(private _value: string = v4()) {}

  public value(): string {
    return this._value;
  }
}
