import knex from 'knex';

export async function up(db: knex) {
  await db.schema.alterTable('user', (table) => {
    table.enum('authentication_method', ['MAGIC_LINK', 'ESTONIAN_ID']);
    table.string('authentication_value');
    table.unique(['authentication_method', 'authentication_value'], 'authentication_details');
  });

  await db('user').update({
    authentication_method: 'MAGIC_LINK',
    authentication_value: db.ref('email'),
  });

  await db.schema.alterTable('user', (table) => {
    table.string('authentication_method').notNullable().alter();
    table.string('authentication_value').notNullable().alter();
    table.string('email').nullable().alter();
    table.dropUnique('email' as any);
  });
}

export async function down(db: knex) {
  await db('user')
    .where({ authentication_method: 'MAGIC_LINK' })
    .update({
      email: db.ref('authentication_value'),
    });
  await db.schema.alterTable('user', (table) => {
    table.string('email').notNullable().unique().alter();
    table.dropColumns('authentication_method', 'authentication_value');
  });
}
