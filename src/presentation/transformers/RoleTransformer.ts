import { RoleDTO } from '../dtos/authorization';
import { Role } from '../../domain/model/authentication/Role';

export class RoleTransformer {
  public toRoleDTO(role: Role): RoleDTO {
    return {
      name: role.name,
      permissions: role.permissions().map(({ name }) => name),
    };
  }
}
