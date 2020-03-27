import { User } from '../../domain/model/user/User';
import { Email } from '../../domain/model/user/Email';
import { UserId } from '../../domain/model/user/UserId';
import { UserRepository } from '../../domain/model/user/UserRepository';

export class GetExistingOrCreateNewUser {
  constructor(private userRepository: UserRepository) {}

  public async execute(email: string) {
    const existingUser = await this.userRepository.findByEmail(
      new Email(email)
    );
    if (existingUser) {
      return existingUser;
    }

    return this.userRepository.save(new User(new UserId(), new Email(email)));
  }
}
