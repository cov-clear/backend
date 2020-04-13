import { Email } from '../../../domain/model/user/Email';
import { RoleNotFoundError, RoleRepository } from '../../../domain/model/authentication/RoleRepository';
import { User } from '../../../domain/model/user/User';
import { UserId } from '../../../domain/model/user/UserId';
import { UserRepository } from '../../../domain/model/user/UserRepository';
import { ADMIN, USER } from '../../../domain/model/authentication/Roles';

export class GetExistingOrCreateNewUser {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
    private setupModeEnabled: boolean
  ) {}

  public async execute(email: string) {
    const existingUser = await this.userRepository.findByEmail(new Email(email));

    if (existingUser) {
      return existingUser;
    }

    const user = new User(new UserId(), new Email(email));
    await this.assignRolesToUser(user, this.getRolesToAssign());

    return this.userRepository.save(user);
  }

  private async assignRolesToUser(user: User, roleNames: string[]) {
    for (const roleName of roleNames) {
      const role = await this.roleRepository.findByName(roleName);
      if (!role) {
        throw new RoleNotFoundError(roleName);
      }
      user.assignRole(role, user.id);
    }
  }

  private getRolesToAssign() {
    return this.setupModeEnabled ? [USER, ADMIN] : [USER];
  }
}
