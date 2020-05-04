import { AccessDeniedError } from '../../../domain/model/AccessDeniedError';
import { ASSIGN_ROLE_TO_USER } from '../../../domain/model/authentication/Permissions';
import { RoleRepository, RoleNotFoundError } from '../../../domain/model/authentication/RoleRepository';
import { UserRepository, UserNotFoundError } from '../../../domain/model/user/UserRepository';
import { UserId } from '../../../domain/model/user/UserId';
import { User } from '../../../domain/model/user/User';

export class AssignRoleToUser {
  constructor(private userRepository: UserRepository, private roleRepository: RoleRepository) {}

  async execute(roleName: string, userId: string, authenticatedUser: User) {
    const role = await this.roleRepository.findByName(roleName);
    if (!role) {
      throw new RoleNotFoundError(roleName);
    }

    const user = await this.userRepository.findByUserId(new UserId(userId));
    if (!user) {
      throw new UserNotFoundError(new UserId(userId));
    }

    if (!authenticatedUser.hasPermission(ASSIGN_ROLE_TO_USER)) {
      throw new AccessDeniedError(ASSIGN_ROLE_TO_USER);
    }

    user.assignRole(role, authenticatedUser.id);
    await this.userRepository.save(user);
    return role;
  }
}
