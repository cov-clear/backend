import knex from 'knex';
import { ADMIN, USER } from '../../domain/model/authentication/Roles';
import {
  ADD_RESULTS_WITH_HIGH_CONFIDENCE,
  ADD_TAKE_HOME_TEST_RESULT,
  ADMINISTER_TEST_WITH_HIGH_CONFIDENCE,
  ASSIGN_PERMISSION_TO_ROLE,
  ASSIGN_ROLE_TO_USER,
  BULK_CREATE_USERS,
  CREATE_NEW_PERMISSION,
  CREATE_NEW_ROLE,
  CREATE_TEST_TYPE,
  LIST_PERMISSIONS,
  LIST_ROLES,
  UPDATE_TEST_TYPE,
  VIEW_ADMIN_REPORTS,
} from '../../domain/model/authentication/Permissions';
import { v4 } from 'uuid';

export async function up(db: knex) {
  await db.schema
    .createTable('role', (table) => {
      table.string('name').primary();
      table.timestamp('creation_time');
    })
    .createTable('permission', (table) => {
      table.string('name').primary();
      table.timestamp('creation_time');
    })
    .createTable('permission_to_role_assignment', (table) => {
      table.uuid('id').primary();
      table.string('role_name');
      table.string('permission_name');
      table.enum('action_type', ['ADD', 'REMOVE']);
      table.uuid('actor');
      table.integer('order');
      table.timestamp('creation_time');
      table.index(['role_name', 'permission_name']);
    })
    .createTable('role_to_user_assignment', (table) => {
      table.uuid('id').primary();
      table.string('role_name');
      table.uuid('user_id');
      table.enum('action_type', ['ADD', 'REMOVE']);
      table.uuid('actor');
      table.integer('order');
      table.timestamp('creation_time');
      table.index(['user_id', 'role_name']);
    });

  await createRolesAndPermissions(db);
}

export async function down(db: knex) {
  await db.schema.dropTable('role');
  await db.schema.dropTable('permission');
  await db.schema.dropTable('permission_to_role_assignment');
  await db.schema.dropTable('role_to_user_assignment');
}

async function createRolesAndPermissions(db: knex) {
  const date = new Date();
  const roles = [USER, ADMIN];

  const permissions = [
    CREATE_NEW_ROLE,
    CREATE_NEW_PERMISSION,
    LIST_ROLES,
    LIST_PERMISSIONS,
    ASSIGN_ROLE_TO_USER,
    ASSIGN_PERMISSION_TO_ROLE,
    BULK_CREATE_USERS,
    CREATE_TEST_TYPE,
    UPDATE_TEST_TYPE,
    ADD_TAKE_HOME_TEST_RESULT,
    ADMINISTER_TEST_WITH_HIGH_CONFIDENCE,
    ADD_RESULTS_WITH_HIGH_CONFIDENCE,
    VIEW_ADMIN_REPORTS,
  ];

  await db('role').insert(roles.map((roleName) => ({ name: roleName, creation_time: date })));
  await db('permission').insert(permissions.map((permissionName) => ({ name: permissionName, creation_time: date })));
  await db('permission_to_role_assignment').insert(
    permissions.map((permissionName, index) => ({
      id: v4(),
      role_name: ADMIN,
      permission_name: permissionName,
      action_type: 'ADD',
      actor: v4(),
      order: index + 1,
      creation_time: date,
    }))
  );
}
