import { UserId } from '../../domain/model/user/UserId';
import { UserRepository, UserNotFoundError } from '../../domain/model/user/UserRepository';
import { Address as ApiAddress, Profile as ApiProfile, UpdateUserCommand } from '../../api/interface';
import { Profile } from '../../domain/model/user/Profile';
import { Address } from '../../domain/model/user/Address';
import { Sex } from '../../domain/model/user/Sex';
import { Country } from '../../domain/model/user/Country';
import { DateOfBirth } from '../../domain/model/user/DateOfBirth';

export class UpdateUser {
  constructor(private userRepository: UserRepository) {}

  public async execute(id: string, command: UpdateUserCommand) {
    const existingUser = await this.userRepository.findByUserId(new UserId(id));
    if (!existingUser) {
      throw new UserNotFoundError(new UserId(id));
    }

    if (command.profile) {
      existingUser.profile = mapApiProfileToProfile(command.profile);
    }
    if (command.address) {
      existingUser.address = mapApiAddressToAddress(command.address);
    }

    return this.userRepository.save(existingUser);
  }
}

function mapApiProfileToProfile(profile: ApiProfile): Profile {
  return new Profile(
    profile.firstName,
    profile.lastName,
    DateOfBirth.fromString(profile.dateOfBirth),
    profile.sex === 'MALE' ? Sex.MALE : Sex.FEMALE
  );
}

export function mapApiAddressToAddress(address?: ApiAddress): Address | undefined {
  return address
    ? {
        address1: address.address1,
        address2: address.address2 || undefined,
        country: new Country(address.countryCode),
        region: address.region || undefined,
        city: address.city,
        postcode: address.postcode,
      }
    : address;
}
