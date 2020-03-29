import { PermissionRepository } from '../../domain/model/authentication/PermissionRepository';
import { Permission } from '../../domain/model/authentication/Permission';
import knex from 'knex';

export class PsqlPermissionRepository implements PermissionRepository {
  constructor(private db: knex) {}

  async findByName(name: string): Promise<Permission | null> {
    const permissionRow: any = await this.db('permission')
      .select(['name', 'creation_time as creationTime'])
      .where('name', '=', name)
      .first();

    if (!permissionRow) {
      return null;
    }
    return new Permission(permissionRow.name, permissionRow.creationTime);
  }

  async save(permission: Permission): Promise<Permission> {
    return await this.db
      .raw(
        `
      insert into permission (name, creation_time)
      values (:name, :creation_time)
    `,
        {
          name: permission.name,
          creation_time: permission.creationTime,
        }
      )
      .then(() => {
        return permission;
      });
  }
}
