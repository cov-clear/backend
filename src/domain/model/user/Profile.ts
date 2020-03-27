import { Sex } from './Sex';

export class Profile {
  constructor(
    readonly firstName: string,
    readonly lastName: string,
    readonly dateOfBirth: string,
    readonly sex: Sex
  ) {}
}
