import { ProfileDTO } from '../../dtos/users/ProfileDTO';
import { AddressDTO } from '../../dtos/users/AddressDTO';

export interface UpdateUserCommand {
  profile?: ProfileDTO;
  address?: AddressDTO;
}
