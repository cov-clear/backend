import { Country } from './Country';

export class Address {
  constructor(
    public readonly address1: string,
    readonly address2: string | undefined,
    readonly city: string,
    readonly region: string,
    readonly postcode: string,
    readonly country: Country
  ) {}
}
