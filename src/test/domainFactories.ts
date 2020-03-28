import { User } from '../domain/model/user/User';
import { UserId } from '../domain/model/user/UserId';
import { Email } from '../domain/model/user/Email';
import { Profile } from '../domain/model/user/Profile';
import { Sex } from '../domain/model/user/Sex';
import { Address } from '../domain/model/user/Address';
import { Country } from '../domain/model/user/Country';
import { DateOfBirth } from '../domain/model/user/DateOfBirth';

export function aNewUser() {
  return new User(new UserId(), anEmail());
}

export function anEmail() {
  return new Email('kostas@tw.ee');
}

export function aUserWithAllInformation() {
  return new User(new UserId(), anEmail(), aProfile(), anAddress());
}

export function aProfile() {
  return new Profile(
    'John',
    'Lennon',
    DateOfBirth.fromString('1940-10-09'),
    Sex.MALE
  );
}

export function anAddress() {
  return new Address(
    '41 Some building',
    'Some street',
    'London',
    'Region',
    'E8132',
    new Country('GR')
  );
}
