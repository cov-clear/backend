import { AccessDeniedError } from '../../../domain/model/AccessDeniedError';
import { CREATE_NEW_PERMISSION } from '../../../domain/model/authentication/Permissions';
import { Permission } from '../../../domain/model/authentication/Permission';
import { PermissionRepository } from '../../../domain/model/authentication/PermissionRepository';
import { User } from '../../../domain/model/user/User';

export class CreatePermission {
  constructor(private permissionRepository: PermissionRepository) {}

  async execute(permissionName: string, authenticatedUser: User) {
    if (!authenticatedUser.hasPermission(CREATE_NEW_PERMISSION)) {
      throw new AccessDeniedError(CREATE_NEW_PERMISSION);
    }

    return this.permissionRepository.save(new Permission(permissionName));
  }
}
