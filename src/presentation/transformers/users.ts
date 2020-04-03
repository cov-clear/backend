import { User } from '../../domain/model/user/User';
import { Address } from '../../domain/model/user/Address';
import { Profile } from '../../domain/model/user/Profile';
import { UserDTO, ProfileDTO, AddressDTO } from '../../presentation/dtos/users';

export class UserTransformer {
  public toUserDTO(user: User): UserDTO {
    return {
      id: user.id.value,
      email: user.email.value,
      creationTime: user.creationTime,
      profile: user.profile ? this.toProfileDTO(user.profile) : undefined,
      address: user.address ? this.toAddressDTO(user.address) : undefined,
    };
  }

  public toProfileDTO(profile: Profile): ProfileDTO {
    return {
      firstName: profile.firstName,
      lastName: profile.lastName,
      sex: profile.sex,
      dateOfBirth: profile.dateOfBirth.toString(),
    };
  }

  public toAddressDTO(address: Address): AddressDTO {
    return {
      address1: address.address1,
      address2: address.address2,
      countryCode: address.country.code,
      postcode: address.postcode,
      city: address.city,
      region: address.region,
    };
  }
}
