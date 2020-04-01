import countries from 'country-list';

import { DomainValidationError } from '../DomainValidationError';
import { Validators } from '../../Validators';

export class Country {
  readonly name: string;

  constructor(readonly code: string) {
    validateCode(code);

    this.name = countries.getName(code) as string;
  }
}

function validateCode(code: string) {
  Validators.validateNotEmpty('countryCode', code);

  if (!countries.getName(code)) {
    throw new DomainValidationError('countryCode', `${code} is not a valid country code`);
  }
}
