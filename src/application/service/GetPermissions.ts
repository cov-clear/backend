import { PermissionRepository } from '../../domain/model/authentication/PermissionRepository';
import { Permission } from '../../domain/model/authentication/Permission';

export class GetPermissions {
  constructor(private permissionRepository: PermissionRepository) {}

  async all(): Promise<Permission[]> {
    return this.permissionRepository.findAll();
  }
}
