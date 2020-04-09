import { Role } from '../../domain/model/authentication/Role';
import { RoleDTO } from '../dtos/authorization/RoleDTO';

export class RoleTransformer {
  public toRoleDTO(role: Role): RoleDTO {
    return {
      name: role.name,
      permissions: role.permissions().map(({ name }) => name),
    };
  }
}
