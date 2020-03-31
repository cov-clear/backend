import { Address } from './Address';
import { Country } from './Country';

describe('Address', () => {
  it('creates a valid address', () => {
    expect(() => {
      new Address(
        'address1',
        'address2',
        'city',
        'region',
        'postcode',
        new Country('GB')
      );
    }).not.toThrow();

    expect(() => {
      new Address(
        'address1',
        undefined,
        'city',
        undefined,
        'postcode',
        new Country('GB')
      );
    }).not.toThrow();
  });

  it('does not accept empty strings', () => {
    expect(() => {
      new Address(
        '',
        'address2',
        'city',
        'region',
        'postcode',
        new Country('GB')
      );
    }).toThrow();

    expect(() => {
      new Address(
        'address1',
        '',
        'city',
        'region',
        'postcode',
        new Country('GB')
      );
    }).toThrow();

    expect(() => {
      new Address(
        'address1',
        'address2',
        '',
        'region',
        'postcode',
        new Country('GB')
      );
    }).toThrow();

    expect(() => {
      new Address(
        'address1',
        'address2',
        'city',
        '',
        'postcode',
        new Country('GB')
      );
    }).toThrow();

    expect(() => {
      new Address(
        'address1',
        'address2',
        'city',
        'region',
        '',
        new Country('GB')
      );
    }).toThrow();
  });
});
