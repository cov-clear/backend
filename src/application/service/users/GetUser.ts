import { User } from '../../../domain/model/user/User';
import { UserId } from '../../../domain/model/user/UserId';
import { UserNotFoundError, UserRepository } from '../../../domain/model/user/UserRepository';

export class GetUser {
  constructor(private userRepository: UserRepository) {}

  async byId(id: string): Promise<User> {
    const user = await this.userRepository.findByUserId(new UserId(id));

    if (!user) {
      throw new UserNotFoundError(new UserId(id));
    }

    return user;
  }
}
