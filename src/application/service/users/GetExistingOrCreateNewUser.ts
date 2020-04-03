import { Email } from '../../../domain/model/user/Email';
import { RoleRepository, RoleNotFoundError } from '../../../domain/model/authentication/RoleRepository';
import { User } from '../../../domain/model/user/User';
import { USER } from '../../../domain/model/authentication/Roles';
import { UserId } from '../../../domain/model/user/UserId';
import { UserRepository } from '../../../domain/model/user/UserRepository';

export class GetExistingOrCreateNewUser {
  constructor(private userRepository: UserRepository, private roleRepository: RoleRepository) {}

  public async execute(email: string, roleName?: string) {
    roleName = roleName ? roleName : USER;

    const existingUser = await this.userRepository.findByEmail(new Email(email));

    if (existingUser) {
      return existingUser;
    }

    const user = new User(new UserId(), new Email(email));
    const role = await this.roleRepository.findByName(roleName);

    if (!role) {
      throw new RoleNotFoundError(roleName);
    }

    user.assignRole(role, user.id);

    return this.userRepository.save(user);
  }
}
