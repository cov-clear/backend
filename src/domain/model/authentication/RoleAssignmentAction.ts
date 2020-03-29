import { Role } from './Role';
import { AssignmentAction } from './AssignmentAction';
import { User } from '../user/User';

export class RoleAssignmentAction extends AssignmentAction<User, Role> {}
