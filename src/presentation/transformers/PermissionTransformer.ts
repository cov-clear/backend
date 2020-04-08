import { PermissionDTO } from '../dtos/authorization';
import { Permission } from '../../domain/model/authentication/Permission';

export class PermissionTransformer {
  public toPermissionDTO(permission: Permission): PermissionDTO {
    return {
      name: permission.name,
    };
  }
}
