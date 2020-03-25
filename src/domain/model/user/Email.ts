import * as EmailValidator from 'email-validator';
import { DomainValidationError } from '../DomainValidationError';

export class Email {
  constructor(private _value: string) {
    if (!EmailValidator.validate(_value)) {
      throw new DomainValidationError('email', 'email not valid');
    }
  }

  public value() {
    return this._value;
  }
}
