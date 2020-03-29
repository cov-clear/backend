import knex from 'knex';

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
    })
    .then(() => {
      db('role').insert({
        name: 'USER',
        creation_time: new Date(),
      });
    });
}

export async function down(db: knex) {
  await db.schema.dropTable('role');
  await db.schema.dropTable('permission');
  await db.schema.dropTable('permission_to_role_assignment');
  await db.schema.dropTable('role_to_user_assignment');
}
