import { Role } from '../../../domain/model/authentication/Role';
import { RoleRepository } from '../../../domain/model/authentication/RoleRepository';

export class GetRoles {
  constructor(private roleRepository: RoleRepository) {}

  async all(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }
}
