import { Country } from './Country';
import { Validators } from '../../Validators';

export class Address {
  constructor(
    readonly address1: string,
    readonly address2: string | undefined,
    readonly city: string,
    readonly region: string | undefined,
    readonly postcode: string,
    readonly country: Country
  ) {
    Validators.validateNotEmpty('address1', address1);
    Validators.validateNotEmpty('city', city);
    Validators.validateNotEmpty('postcode', postcode);
    Validators.validateNotNull('country', country);
    Validators.validateOptionalNotEmpty('address2', address2);
    Validators.validateOptionalNotEmpty('region', region);

    this.address1 = this.address1.trim();
    this.address2 = this.address2?.trim();
    this.city = this.city.trim();
    this.postcode = this.postcode.trim();
    this.region = this.region?.trim();
  }
}
