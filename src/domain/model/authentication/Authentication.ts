import { User } from '../user/User';
import { Permission } from './Permission';
import { Role } from './Role';

export class Authentication {
  constructor(
    readonly user: User,
    readonly roles: Array<Role>,
    readonly permissions: Array<Permission>
  ) {}
}
