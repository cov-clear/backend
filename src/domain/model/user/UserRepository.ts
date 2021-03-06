import { User } from './User';
import { Email } from './Email';
import { UserId } from './UserId';
import { ResourceNotFoundError } from '../ResourceNotFoundError';
import { AuthenticationDetails } from './AuthenticationDetails';

export interface UserRepository {
  save(user: User): Promise<User>;

  getTotalAmountOfUsers(): Promise<number>;

  findByUserId(userId: UserId): Promise<User | null>;

  findByAuthenticationDetails(authenticationDetails: AuthenticationDetails): Promise<User | null>;
}

export class UserNotFoundError extends ResourceNotFoundError {
  constructor(readonly userId: UserId) {
    super('user', userId.value);
  }
}
