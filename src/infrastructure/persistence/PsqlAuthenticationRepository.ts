import { AuthenticationRepository } from '../../domain/model/authentication/AuthenticationRepository';
import { Authentication } from '../../domain/model/authentication/Authentication';
import knex from 'knex';
import { User } from '../../domain/model/user/User';

export class PsqlAuthenticationRepository implements AuthenticationRepository {
  constructor(private db: knex) {}

  async getAuthentication(user: User): Promise<Authentication> {
    //TODO: Get roles and permissions
    return {
      user,
      roles: [],
      permissions: [],
    };
  }
}
