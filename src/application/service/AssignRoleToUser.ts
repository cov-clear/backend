import { UserRepository, UserNotFoundError } from '../../domain/model/user/UserRepository';
import { RoleRepository } from '../../domain/model/authentication/RoleRepository';
import { UserId } from '../../domain/model/user/UserId';
import { RoleNotFoundError } from '../../domain/model/authentication/RoleNotFoundError';
import { User } from '../../domain/model/user/User';
import { ASSIGN_ROLE_TO_USER } from '../../domain/model/authentication/Permissions';
import { AccessDeniedError } from '../../domain/model/AccessDeniedError';

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

    if (!this.hasPermissionToAssignRole(authenticatedUser)) {
      throw new AccessDeniedError(ASSIGN_ROLE_TO_USER);
    }

    user.assignRole(role, authenticatedUser.id);
    await this.userRepository.save(user);
    return role;
  }

  private hasPermissionToAssignRole(authenticatedUser: User) {
    return !!authenticatedUser.permissions.find((name) => name === ASSIGN_ROLE_TO_USER);
  }
}
