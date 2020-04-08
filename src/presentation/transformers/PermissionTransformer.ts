import { Permission } from '../../domain/model/authentication/Permission';
import { PermissionDTO } from '../dtos/authorization/PermissionDTO';

export class PermissionTransformer {
  public toPermissionDTO(permission: Permission): PermissionDTO {
    return {
      name: permission.name,
    };
  }
}
