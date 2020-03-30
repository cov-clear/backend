import { RoleRepository } from '../../domain/model/authentication/RoleRepository';
import { Role } from '../../domain/model/authentication/Role';

export class GetRoles {
  constructor(private roleRepository: RoleRepository) {}

  async all(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }
}
