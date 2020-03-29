import knex from 'knex';

const ACCESS_PASS_TABLE = 'sharing_code';

export async function up(db: knex) {
  await db.schema.createTable(ACCESS_PASS_TABLE, (table) => {
    table.uuid('id').primary();
    table.uuid('actor_user_id').notNullable();
    table.uuid('subject_user_id').notNullable();
    table.timestamp('creation_time').notNullable();
  });
  // TODO add compound index
}

export async function down(db: knex) {
  await db.schema.dropTable(ACCESS_PASS_TABLE);
}
