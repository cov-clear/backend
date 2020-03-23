import Knex from 'knex';

export async function up(db: Knex) {
  await db.schema.createTable('example_users', table => {
    table.bigIncrements('id');
    table.timestamps(true, true);
    table
      .string('email')
      .unique()
      .notNullable();
    table.string('hashed_password').notNullable();
  });
}

export async function down(db: Knex) {
  await db.schema.dropTable('example_users');
}
