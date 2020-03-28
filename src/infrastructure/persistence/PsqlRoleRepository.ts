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
        'role.name as role_name',
        'role.creation_time as role_creation_time',
        'pra.id as pra_id',
        'pra.creation_time as pra_creation_time',
        'pra.action_type as pra_action_type',
        'pra.actor as pra_actor',
        'pra.order as pra_order',
        'permission.name as permission_name',
        'permission.creation_time as permission_creation_time',
      ])
      .leftJoin(
        'permission_to_role_assignment as pra',
        'role.name',
        'pra.role_name'
      )
      .leftJoin('permission', 'pra.permission_name', 'permission.name')
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
  const role = new Role(roleRows[0].role_name, roleRows[0].role_creation_time);
  const permissionAssignmentActions = roleRows
    .filter(
      (assignmentAction) =>
        assignmentAction.permission_name &&
        assignmentAction.permission_creation_time
    )
    .map((assignmentAction) => {
      const permission = new Permission(
        assignmentAction.permission_name,
        assignmentAction.permission_creation_time
      );
      return new PermissionAssignmentAction(
        new AssignmentId(assignmentAction.pra_id),
        role,
        permission,
        assignmentAction.pra_action_type === 'ADD'
          ? AssignmentActionType.ADD
          : AssignmentActionType.REMOVE,
        new UserId(assignmentAction.pra_actor),
        assignmentAction.pra_order,
        assignmentAction.pra_creation_time
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
