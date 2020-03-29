import { Permission } from './Permission';
import { AssignmentActions } from './AssignmentActions';
import { UserId } from '../user/UserId';
import { DomainValidationError } from '../DomainValidationError';

const ROLE_NAME_REG_EXP = /^[A-Z]+[A-Z_]*[A-Z]+$/;

export class Role {
  readonly permissionAssignments: AssignmentActions<Role, Permission>;

  constructor(readonly name: string, readonly creationTime: Date = new Date()) {
    validateName(name);
    this.permissionAssignments = new AssignmentActions(
      [],
      (permission) => permission.name
    );
  }

  assignPermission(permission: Permission, actor: UserId) {
    this.permissionAssignments.addAssignment(permission, this, actor);
  }

  removePermission(permission: Permission, actor: UserId) {
    this.permissionAssignments.removeAssignment(permission, this, actor);
  }

  permissions(): Permission[] {
    return this.permissionAssignments.activeAssignments();
  }
}

function validateName(name: String) {
  if (!name.match(ROLE_NAME_REG_EXP)) {
    throw new DomainValidationError(
      'roleName',
      'Role name can be comprised of only capital english letters and underscores(_)'
    );
  }
}
