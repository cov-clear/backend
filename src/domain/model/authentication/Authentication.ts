import { User } from '../user/User';

export class Authentication {
  constructor(readonly user: User, readonly roles: string[], readonly permissions: string[]) {}
}
