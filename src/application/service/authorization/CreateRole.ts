import { AccessDeniedError } from '../../../domain/model/AccessDeniedError';
import { CREATE_NEW_ROLE } from '../../../domain/model/authentication/Permissions';
import { Role } from '../../../domain/model/authentication/Role';
import { RoleRepository } from '../../../domain/model/authentication/RoleRepository';
import { User } from '../../../domain/model/user/User';

export class CreateRole {
  constructor(private roleRepository: RoleRepository) {}

  async execute(roleName: string, authenticatedUser: User) {
    if (!this.hasPermissionToCreateNewRole(authenticatedUser)) {
      throw new AccessDeniedError(CREATE_NEW_ROLE);
    }

    return this.roleRepository.save(new Role(roleName));
  }

  private hasPermissionToCreateNewRole(authenticatedUser: User) {
    return !!authenticatedUser.permissions.find((name) => name === CREATE_NEW_ROLE);
  }
}
