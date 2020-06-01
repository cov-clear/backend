import knex from 'knex';

export async function countRowsInTable(database: knex, table: string): Promise<number> {
  const results: { count: string }[] = await database(table).count();
  if (!results || !results.length) {
    return 0;
  }
  return parseInt(results[0].count, 10);
}
