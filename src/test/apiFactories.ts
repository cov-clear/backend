import { Address as ApiAddress, Profile as ApiProfile } from '../api/interface';

export function anApiAddress(): ApiAddress {
  return {
    address1: 'Some address',
    address2: 'Some street',
    city: 'London',
    countryCode: 'GB',
    postcode: 'E8123',
    region: 'Some Region',
  };
}

export function anApiProfile(): ApiProfile {
  return {
    firstName: 'John',
    lastName: 'Lennon',
    dateOfBirth: '09-10-1940',
    sex: 'MALE',
  };
}
