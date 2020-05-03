import { AuthenticationDetailsDTO } from '../../dtos/users/AuthenticationDetailsDTO';

export interface CreateUserCommand {
  authenticationDetails: AuthenticationDetailsDTO;
}
