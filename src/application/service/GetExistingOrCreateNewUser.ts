import { User } from '../../domain/model/user/User';
import { Email } from '../../domain/model/user/Email';
import { UserId } from '../../domain/model/user/UserId';
import { UserRepository } from '../../domain/model/user/UserRepository';
import { RoleRepository } from '../../domain/model/authentication/RoleRepository';
import { RoleNotFoundError } from '../../domain/model/authentication/RoleNotFoundError';
import { USER } from '../../domain/model/authentication/Roles';

export class GetExistingOrCreateNewUser {
  constructor(private userRepository: UserRepository, private roleRepository: RoleRepository) {}

  public async execute(email: string) {
    const existingUser = await this.userRepository.findByEmail(new Email(email));
    if (existingUser) {
      return existingUser;
    }

    const user = new User(new UserId(), new Email(email));
    const userRole = await this.roleRepository.findByName(USER);
    if (!userRole) {
      throw new RoleNotFoundError(USER);
    }
    user.assignRole(userRole, user.id);
    return this.userRepository.save(user);
  }
}
