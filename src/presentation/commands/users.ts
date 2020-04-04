import { ProfileDTO, AddressDTO } from '../dtos/users';

export interface CreateUserCommand {
  email: string;
  roles: string[];
}

export interface UpdateUserCommand {
  profile?: ProfileDTO;
  address?: AddressDTO;
}
