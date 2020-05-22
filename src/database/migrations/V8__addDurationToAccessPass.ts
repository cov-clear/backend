import knex from 'knex';

const ACCESS_PASS_TABLE = 'access_pass';

export async function up(db: knex) {
  await db.schema.table(ACCESS_PASS_TABLE, (table) => {
    table.integer('duration');
  });

  await db(ACCESS_PASS_TABLE).where({ duration: null }).update({ duration: 60 });

  await db.schema.alterTable(ACCESS_PASS_TABLE, (table) => {
    table.integer('duration').notNullable().alter();
  });
}

export async function down(db: knex) {
  await db.schema.alterTable(ACCESS_PASS_TABLE, (table) => {
    table.dropColumn('duration');
  });
}
