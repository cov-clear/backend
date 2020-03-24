import knex from 'knex';

import { DB_CONNECTION_URL } from '../config';

const database = knex({
  client: 'pg',
  connection: DB_CONNECTION_URL,
});

export function migrateLatest(): PromiseLike<any> {
  return database.migrate.latest({
    directory: `${__dirname}/migrations`,
  });
}

export default database;
