import { User } from './User';
import { Email } from './Email';
import { UserId } from './UserId';
import { ResourceNotFoundError } from '../ResourceNotFoundError';
import { AuthenticationDetails } from './AuthenticationDetails';

export interface UserRepository {
  save(user: User): Promise<User>;

  findByUserId(userId: UserId): Promise<User | null>;
  findByUserIds(userIds: Array<UserId>): Promise<Array<User>>;

  findByAuthenticationDetails(authenticationDetails: AuthenticationDetails): Promise<User | null>;
}

export class UserNotFoundError extends ResourceNotFoundError {
  constructor(readonly userId: UserId) {
    super('user', userId.value);
  }
}
