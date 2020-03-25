import { rollbackDatabase, migrateLatest } from '../database';
import logger from '../logger';

export async function migrateDatabase() {
  try {
    await rollbackDatabase();
    await migrateLatest();
  } catch (error) {
    logger.error('Failed to apply migrations', error);
    process.exit(1);
  }
}
