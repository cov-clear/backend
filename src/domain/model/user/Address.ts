import { Country } from './Country';
import { DomainValidationError } from '../DomainValidationError';

export class Address {
  constructor(
    public readonly address1: string,
    readonly address2: string | undefined,
    readonly city: string,
    readonly region: string | undefined,
    readonly postcode: string,
    readonly country: Country
  ) {
    validateNotEmpty('address1', address1);
    validateNotEmpty('city', city);
    validateNotEmpty('postcode', postcode);
    validateNotNull('country', country);
    validateOptionalNotEmpty('address2', address2);
    validateOptionalNotEmpty('region', region);
    this.address1 = this.address1.trim();
    this.address2 = this.address2?.trim();
    this.city = this.city.trim();
    this.postcode = this.postcode.trim();
    this.region = this.region?.trim();
  }
}

function validateOptionalNotEmpty(fieldName: string, value?: string) {
  if (value !== undefined && value !== null && value.trim().length === 0) {
    throw new DomainValidationError(fieldName, 'Cannot be an empty string');
  }
}

function validateNotNull(fieldName: string, value: object) {
  if (!value) {
    throw new DomainValidationError(fieldName, 'Cannot be null');
  }
}

function validateNotEmpty(fieldName: string, value: string) {
  if (!value || value.trim().length === 0) {
    throw new DomainValidationError(fieldName, 'Cannot be an empty string');
  }
}
