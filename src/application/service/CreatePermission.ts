import { User } from '../../domain/model/user/User';
import { CREATE_NEW_PERMISSION } from '../../domain/model/authentication/Permissions';
import { AccessDeniedError } from '../../domain/model/AccessDeniedError';
import { PermissionRepository } from '../../domain/model/authentication/PermissionRepository';
import { Permission } from '../../domain/model/authentication/Permission';

export class CreatePermission {
  constructor(private permissionRepository: PermissionRepository) {}

  async execute(permissionName: string, authenticatedUser: User) {
    if (!this.hasPermissionToCreateNewRole(authenticatedUser)) {
      throw new AccessDeniedError(CREATE_NEW_PERMISSION);
    }

    return this.permissionRepository.save(new Permission(permissionName));
  }

  private hasPermissionToCreateNewRole(authenticatedUser: User) {
    return !!authenticatedUser.permissions.find(
      (name) => name === CREATE_NEW_PERMISSION
    );
  }
}
