import * as EmailValidator from 'email-validator';
import { DomainValidationError } from './DomainValidationError';

export class Email {
  constructor(public value: string) {
    if (!EmailValidator.validate(value)) {
      throw new DomainValidationError('email', 'email not valid');
    }
  }
}
