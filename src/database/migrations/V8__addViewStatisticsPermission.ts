import knex from 'knex';
import { ADMIN } from '../../domain/model/authentication/Roles';
import { VIEW_STATISTICS } from '../../domain/model/authentication/Permissions';
import { v4 } from 'uuid';

export async function up(db: knex) {
  const date = new Date();
  await db('permission').insert({ name: VIEW_STATISTICS, creation_time: date });
  await db('permission_to_role_assignment').insert({
    id: v4(),
    role_name: ADMIN,
    permission_name: VIEW_STATISTICS,
    action_type: 'ADD',
    actor: v4(),
    order: 1,
    creation_time: date,
  });
}

export async function down(db: knex) {
  await db('permission_to_role_assignment').where({ permission_name: VIEW_STATISTICS }).delete();
  await db('permission').where({ name: VIEW_STATISTICS }).delete();
}
