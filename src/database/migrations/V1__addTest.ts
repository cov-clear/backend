import knex from 'knex';

const TEST_TABLE = 'test';
const TEST_RESULTS_TABLE = 'test_results';

export async function up(db: knex) {
  await db.schema.createTable(TEST_TABLE, (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').notNullable();
    table.uuid('test_type_id').notNullable();
    table.timestamp('creation_time').notNullable().index();
  });

  await db.schema
    .createTable(TEST_RESULTS_TABLE, (table) => {
      table.uuid('id').primary();
      table.uuid('test_id').unique();
      table.uuid('creator_id').notNullable();
      table.jsonb('details').nullable();
      table.timestamp('creation_time').notNullable();
    })
    .raw('CREATE INDEX IDX_RESULTS on "test_results" USING GIN (details)');
}

export async function down(db: knex) {
  await db.schema.dropTable(TEST_TABLE);
  await db.schema.dropTable(TEST_RESULTS_TABLE);
}
