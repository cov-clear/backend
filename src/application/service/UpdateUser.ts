import { UserId } from '../../domain/model/user/UserId';
import { UserRepository } from '../../domain/model/user/UserRepository';
import {
  Address as ApiAddress,
  Profile as ApiProfile,
  UpdateUserCommand,
} from '../../api/interface';
import { Profile } from '../../domain/model/user/Profile';
import { Address } from '../../domain/model/user/Address';
import { Sex } from '../../domain/model/user/Sex';

export class UpdateUser {
  constructor(private userRepository: UserRepository) {}

  public async execute(id: string, command: UpdateUserCommand) {
    const existingUser = await this.userRepository.findByUserId(new UserId(id));
    if (!existingUser) {
      throw new UserNotFoundError(id);
    }

    if (command.profile) {
      existingUser.profile = mapProfile(command.profile);
    }
    if (command.address) {
      existingUser.address = mapAddress(command.address);
    }

    return this.userRepository.save(existingUser);
  }
}

function mapProfile(profile: ApiProfile): Profile {
  return new Profile(
    profile.firstName,
    profile.lastName,
    profile.dateOfBirth,
    profile.sex === 'MALE' ? Sex.MALE : Sex.FEMALE
  );
}

function mapAddress(address?: ApiAddress): Address {
  return address as Address;
}

export class UserNotFoundError extends Error {
  constructor(readonly userId: string) {
    super();
  }
}
