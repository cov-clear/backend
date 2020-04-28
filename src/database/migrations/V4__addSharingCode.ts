import knex from 'knex';

const SHARING_CODE_TABLE = 'sharing_code';

export async function up(db: knex) {
  await db.schema.createTable(SHARING_CODE_TABLE, (table) => {
    table.uuid('code').primary();
    table.uuid('user_id').notNullable();
    table.integer('duration').notNullable();
    table.timestamp('creation_time').notNullable().index();
  });
}

export async function down(db: knex) {
  await db.schema.dropTable(SHARING_CODE_TABLE);
}
