import { Permission } from '../../../domain/model/authentication/Permission';
import { PermissionRepository } from '../../../domain/model/authentication/PermissionRepository';

export class GetPermissions {
  constructor(private permissionRepository: PermissionRepository) {}

  async all(): Promise<Permission[]> {
    return this.permissionRepository.findAll();
  }
}
