import Knex from 'knex';

export async function up(db: Knex) {
  await db.schema.createTable('user', (table) => {
    table.bigIncrements('id').primary();
    table.string('email').unique().notNullable();
    table.timestamp('creation_time').nullable().index();
    table.jsonb('personal_information').nullable();
    table.jsonb('latest_address').nullable();
  });
}

export async function down(db: Knex) {
  await db.schema.dropTable('user');
}
