import { User } from './User';
import { Email } from './Email';
import { UserId } from './UserId';

export interface UserRepository {
  save(user: User): Promise<User>;

  findByUserId(userId: UserId): Promise<User | null>;

  findByEmail(email: Email): Promise<User | null>;
}
