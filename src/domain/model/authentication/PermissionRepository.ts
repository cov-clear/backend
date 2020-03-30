import { Permission } from './Permission';

export interface PermissionRepository {
  save(role: Permission): Promise<Permission>;

  findByName(name: string): Promise<Permission | null>;

  findAll(): Promise<Permission[]>;
}
