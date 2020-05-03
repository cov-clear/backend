import { ProfileDTO } from './ProfileDTO';
import { AddressDTO } from './AddressDTO';
import { AuthenticationDetailsDTO } from './AuthenticationDetailsDTO';

export interface UserDTO {
  id: string;
  email?: string;
  creationTime: Date;
  authenticationDetails: AuthenticationDetailsDTO;
  profile?: ProfileDTO;
  address?: AddressDTO;
}

export interface RestrictedUserDTO {
  id: string;
  authenticationDetails: AuthenticationDetailsDTO;
}
