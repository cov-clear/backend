import { RoleRepository } from '../../domain/model/authentication/RoleRepository';
import knex from 'knex';
import { Role } from '../../domain/model/authentication/Role';
import { PermissionAssignmentAction } from '../../domain/model/authentication/PermissionAssignmentAction';
import { Permission } from '../../domain/model/authentication/Permission';
import { AssignmentId } from '../../domain/model/authentication/AssignmentAction';
import { AssignmentActionType } from '../../domain/model/authentication/AssignmentActionType';
import { UserId } from '../../domain/model/user/UserId';

export class PsqlRoleRepository implements RoleRepository {
  constructor(private db: knex) {}

  async findByName(name: string): Promise<Role | null> {
    const roleRows: any[] = await this.db('role')
      .select([
        'role.name as roleName',
        'role.creation_time as roleCreationTime',
        'pra.id as praId',
        'pra.creation_time as praCreationTime',
        'pra.action_type as praActionType',
        'pra.actor as praActor',
        'pra.order as praOrder',
        'p.name as permissionName',
        'p.creation_time as permissionCreationTime',
      ])
      .leftJoin(
        'permission_to_role_assignment as pra',
        'role.name',
        'pra.role_name'
      )
      .leftJoin('permission as p', 'pra.permission_name', 'p.name')
      .where('role.name', '=', name);

    if (roleRows.length === 0) {
      return null;
    }

    return createRoleWithAssignedPermissions(roleRows);
  }

  async save(role: Role): Promise<Role> {
    await this.db
      .raw(
        `
      insert into role (name, creation_time)
      values (:name, :creation_time)
      on conflict do nothing
    `,
        {
          name: role.name,
          creation_time: role.creationTime,
        }
      )
      .then(() => {
        return role;
      });
    await Promise.all(
      role.permissionAssignments.newAssignmentActions.map(
        this.savePermissionAssignment.bind(this)
      )
    );
    Reflect.set(role.permissionAssignments, 'newAssignmentActions', []);
    return role;
  }

  private async savePermissionAssignment(
    permissionAssignmentAction: PermissionAssignmentAction
  ) {
    await this.db('permission_to_role_assignment').insert({
      id: permissionAssignmentAction.id.value,
      role_name: permissionAssignmentAction.assignedTo.name,
      permission_name: permissionAssignmentAction.assignedResource.name,
      actor: permissionAssignmentAction.actor.value,
      creation_time: permissionAssignmentAction.creationTime,
      order: permissionAssignmentAction.order,
      action_type: permissionAssignmentAction.actionType.toString(),
    });
  }
}

export function createRoleWithAssignedPermissions(roleRows: any[]): Role {
  const role = new Role(roleRows[0].roleName, roleRows[0].roleCreationTime);
  const permissionAssignmentActions = roleRows
    .filter(
      (assignmentAction) =>
        assignmentAction.permissionName &&
        assignmentAction.permissionCreationTime
    )
    .map((assignmentAction) => {
      const permission = new Permission(
        assignmentAction.permissionName,
        assignmentAction.permissionCreationTime
      );
      return new PermissionAssignmentAction(
        new AssignmentId(assignmentAction.praId),
        role,
        permission,
        assignmentAction.praActionType === 'ADD'
          ? AssignmentActionType.ADD
          : AssignmentActionType.REMOVE,
        new UserId(assignmentAction.praActor),
        assignmentAction.praOrder,
        assignmentAction.praCreationTime
      );
    });
  Reflect.set(
    role.permissionAssignments,
    'assignmentActions',
    permissionAssignmentActions
  );
  Reflect.set(role.permissionAssignments, 'newAssignmentActions', []);
  return role;
}
