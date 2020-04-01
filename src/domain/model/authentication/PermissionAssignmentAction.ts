import { Role } from './Role';
import { Permission } from './Permission';
import { AssignmentAction } from './AssignmentAction';

export class PermissionAssignmentAction extends AssignmentAction<Role, Permission> {}
