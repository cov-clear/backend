import knex from 'knex';

const SHARING_CODE_TABLE = 'sharing_code';

export async function up(db: knex) {
  await db.schema.table(SHARING_CODE_TABLE, (table) => {
    table.integer('access_duration');
  });

  await db(SHARING_CODE_TABLE).where({ access_duration: null }).update({ access_duration: 15 });

  await db.schema.alterTable(SHARING_CODE_TABLE, (table) => {
    table.integer('access_duration').notNullable().alter();
  });
}

export async function down(db: knex) {
  await db.schema.alterTable(SHARING_CODE_TABLE, (table) => {
    table.dropColumn('access_duration');
  });
}
