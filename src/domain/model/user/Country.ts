import countries from 'country-list';
import { DomainValidationError } from '../DomainValidationError';

export class Country {
  readonly name: string;

  constructor(readonly code: string) {
    validateCode(code);
    this.name = countries.getName(code) as string;
  }
}

function validateCode(code: string) {
  if (!code) {
    throw new DomainValidationError('countryCode', 'Cannot be null or undefined');
  }
  if (!countries.getName(code)) {
    throw new DomainValidationError('countryCode', `${code} is not a valid country code`);
  }
}
