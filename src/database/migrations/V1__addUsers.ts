import knex from 'knex';

export async function up(db: knex) {
  await db.schema.createTable('user', (table) => {
    table.uuid('id').primary();
    table.string('email').unique().notNullable();
    table.timestamp('creation_time').notNullable();
    table.timestamp('modification_time').notNullable();
    table.jsonb('profile').nullable();
    table.jsonb('address').nullable();
  });
}

export async function down(db: knex) {
  await db.schema.dropTable('user');
}
