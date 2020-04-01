import { AccessDeniedError } from '../../../domain/model/AccessDeniedError';
import { ASSIGN_PERMISSION_TO_ROLE } from '../../../domain/model/authentication/Permissions';
import { PermissionRepository } from '../../../domain/model/authentication/PermissionRepository';
import { PermissionNotFoundError } from '../../../domain/model/authentication/PermissionNotFoundError';
import { RoleRepository, RoleNotFoundError } from '../../../domain/model/authentication/RoleRepository';
import { User } from '../../../domain/model/user/User';

export class AssignPermissionToRole {
  constructor(private roleRepository: RoleRepository, private permissionRepository: PermissionRepository) {}

  async execute(permissionName: string, roleName: string, authenticatedUser: User) {
    const role = await this.roleRepository.findByName(roleName);
    if (!role) {
      throw new RoleNotFoundError(roleName);
    }

    const permission = await this.permissionRepository.findByName(permissionName);
    if (!permission) {
      throw new PermissionNotFoundError(permissionName);
    }

    if (!this.hasPermissionToAssignPermission(authenticatedUser)) {
      throw new AccessDeniedError(ASSIGN_PERMISSION_TO_ROLE);
    }

    role.assignPermission(permission, authenticatedUser.id);
    await this.roleRepository.save(role);
    return permission;
  }

  private hasPermissionToAssignPermission(authenticatedUser: User) {
    return !!authenticatedUser.permissions.find((name) => name === ASSIGN_PERMISSION_TO_ROLE);
  }
}
