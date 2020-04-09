import { ProfileDTO } from './ProfileDTO';
import { AddressDTO } from './AddressDTO';

export interface UserDTO {
  id: string;
  email: string;
  creationTime: Date;
  profile?: ProfileDTO;
  address?: AddressDTO;
}
