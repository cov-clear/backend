import { migrateLatest, rollbackDatabase } from '../database';
import logger from '../logger';
import { createSeedDataForTestingPeriod } from '../database/testSeed';

export async function migrateDatabase() {
  try {
    //TODO: Remove before rolling out to production
    await rollbackDatabase();

    await migrateLatest();

    //TODO: Remove before rolling out to production
    await createSeedDataForTestingPeriod();
  } catch (error) {
    logger.error('Failed to apply migrations', error);
    process.exit(1);
  }
}
