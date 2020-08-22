import knex from 'knex';

export async function up(db: knex) {
  await db.schema.alterTable('test_results', (table) => {
    table.string('notes', 3000).notNullable().alter();
  });
}

export async function down(db: knex) {
  await db.schema.alterTable('test_results', (table) => {
    table.string('notes').notNullable().alter();
  });
}
