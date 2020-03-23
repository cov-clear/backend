import knex from 'knex';

import { DB_CONNECTION } from '../config';

const database = knex({
  client: 'pg',
  connection: DB_CONNECTION,
});

export function migrateLatest(): PromiseLike<any> {
  return database.migrate.latest({
    directory: `${__dirname}/migrations`,
  });
}

export default database;
