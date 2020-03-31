import knex from 'knex';

const TEST_TABLE = 'test';

export async function up(db: knex) {
  await db.schema
    .createTable(TEST_TABLE, (table) => {
      table.uuid('id').primary();
      table.uuid('user_id').notNullable();
      table.uuid('test_type_id').notNullable();
      table.timestamp('creation_time').notNullable().index();
      table.jsonb('results').nullable();
      table.uuid('results_creator_id').nullable();
      table.timestamp('results_creation_time').nullable();
    })
    .raw('CREATE INDEX IDX_RESULTS on "test" USING GIN (results)');
}

export async function down(db: knex) {
  await db.schema.dropTable(TEST_TABLE);
}
