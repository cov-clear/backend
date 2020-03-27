import { Email } from './Email';
import { UserId } from './UserId';
import { Address } from './Address';
import { Profile } from './Profile';
import { DomainValidationError } from '../DomainValidationError';

export class User {
  constructor(
    readonly id: UserId,
    readonly email: Email,
    private _profile?: Profile,
    private _address?: Address,
    readonly creationTime: Date = new Date(),
    private _modificationTime: Date = new Date()
  ) {}

  set profile(newProfile) {
    if (!newProfile) {
      throw new DomainValidationError(
        'profile',
        'Cannot set profile to null or undefined'
      );
    }
    this._profile = newProfile;
    this._modificationTime = new Date();
  }

  get profile() {
    return this._profile;
  }

  set address(newAddress) {
    if (!newAddress) {
      throw new DomainValidationError(
        'profile.address',
        'Cannot set address to null or undefined'
      );
    }
    this._address = newAddress;
    this._modificationTime = new Date();
  }

  get address() {
    return this._address;
  }

  get modificationTime() {
    return this._modificationTime;
  }
}
