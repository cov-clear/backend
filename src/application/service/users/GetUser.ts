import { User } from '../../../domain/model/user/User';
import { UserId } from '../../../domain/model/user/UserId';
import { UserRepository } from '../../../domain/model/user/UserRepository';

export class GetUser {
  constructor(private userRepository: UserRepository) {}

  async byId(id: string): Promise<User | null> {
    return this.userRepository.findByUserId(new UserId(id));
  }
}
