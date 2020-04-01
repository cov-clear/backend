import { Role } from './Role';
import { ResourceNotFoundError } from '../ResourceNotFoundError';

export interface RoleRepository {
  save(role: Role): Promise<Role>;

  findByName(roleName: string): Promise<Role | null>;

  findAll(): Promise<Role[]>;
}

export class RoleNotFoundError extends ResourceNotFoundError {
  constructor(roleName: string) {
    super('role', roleName);
  }
}
