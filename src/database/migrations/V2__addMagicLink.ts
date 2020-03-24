import Knex from 'knex';

export async function up(db: Knex) {
  await db.schema.createTable('magic_link', (table) => {
    table.uuid('id').primary();
    table.string('email').notNullable();
    table.string('code').notNullable();
    table.boolean('active').notNullable();
    table.timestamp('creation_time').notNullable().index();
  });
}

export async function down(db: Knex) {
  await db.schema.dropTable('magic_link');
}
