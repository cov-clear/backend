import { Role } from './Role';

export interface RoleRepository {
  save(role: Role): Promise<Role>;

  findByName(roleName: string): Promise<Role | null>;

  findAll(): Promise<Role[]>;
}
