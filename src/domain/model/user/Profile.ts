import { Sex } from './Sex';
import { DateOfBirth } from './DateOfBirth';

export class Profile {
  constructor(
    readonly firstName: string,
    readonly lastName: string,
    readonly dateOfBirth: DateOfBirth,
    readonly sex: Sex
  ) {}
}
