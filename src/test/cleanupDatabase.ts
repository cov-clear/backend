import knex from 'knex';

export async function cleanupDatabase(database: knex) {
  const schemas = ['public'];

  await database.raw(
    `
      DO
      $func$
      BEGIN
        EXECUTE
        (
          SELECT 'TRUNCATE TABLE ' || string_agg(format('%I.%I', table_schema, table_name), ', ') || ' RESTART IDENTITY CASCADE'
          FROM information_schema.tables
          WHERE table_schema IN (${schemas.map((x) => `'${x}'`).join(', ')})
          AND table_type = 'BASE TABLE'
        );
      END
      $func$;
    `
  );
}
