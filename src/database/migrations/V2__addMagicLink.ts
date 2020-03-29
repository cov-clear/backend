import knex from 'knex';

export async function up(db: knex) {
  await db.schema.createTable('magic_link', (table) => {
    table.string('code').notNullable().primary();
    table.string('email').notNullable();
    table.boolean('active').notNullable();
    table.timestamp('creation_time').notNullable().index();
  });
}

export async function down(db: knex) {
  await db.schema.dropTable('magic_link');
}
