import knex from 'knex';

import * as config from '../config';

const database = knex({
  client: 'pg',
  connection: config.get('db.connectionUrl'),
});

const migrationConfig = {
  directory: `${__dirname}/migrations`,
};

export async function migrateLatest() {
  return database.migrate.latest(migrationConfig);
}

export async function cleanupDatabase() {
  return database.migrate.rollback(migrationConfig);
}

export default database;
