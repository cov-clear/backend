import { AccessDeniedError } from '../../../domain/model/AccessDeniedError';
import { CREATE_NEW_ROLE } from '../../../domain/model/authentication/Permissions';
import { Role } from '../../../domain/model/authentication/Role';
import { RoleRepository } from '../../../domain/model/authentication/RoleRepository';
import { User } from '../../../domain/model/user/User';

export class CreateRole {
  constructor(private roleRepository: RoleRepository) {}

  async execute(roleName: string, authenticatedUser: User) {
    if (!authenticatedUser.hasPermission(CREATE_NEW_ROLE)) {
      throw new AccessDeniedError(CREATE_NEW_ROLE);
    }

    return this.roleRepository.save(new Role(roleName));
  }
}
