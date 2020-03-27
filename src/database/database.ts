import knex from 'knex';
import * as config from '../config';
import logger from '../logger';

const migrationConfig = {
  directory: `${__dirname}/migrations`,
};

const database = knex({
  client: 'pg',
  connection: config.get('db.connectionUrl'),
});

export async function migrateLatest() {
  const connection = knex({
    client: 'pg',
    connection: config.get('db.connectionUrl'),
  });
  try {
    await connection.migrate.latest(migrationConfig);
  } catch (e) {
    logger.error('Failed to migrate database', e);
  } finally {
    await connection.destroy();
  }
}

export async function rollbackDatabase() {
  const connection = knex({
    client: 'pg',
    connection: config.get('db.connectionUrl'),
  });
  try {
    await connection.migrate.rollback(migrationConfig);
  } catch (e) {
    logger.error('Failed to rollback database', e);
    throw e;
  } finally {
    await connection.destroy();
  }
}

export default database;
