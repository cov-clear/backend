import { cleanupDatabase, migrateLatest } from '../database';
import logger from '../logger';

export async function migrateDatabase() {
  try {
    await cleanupDatabase();
    await migrateLatest();
  } catch (e) {
    logger.error('Failed to apply migrations', e);
    process.exit(1);
  }
}
