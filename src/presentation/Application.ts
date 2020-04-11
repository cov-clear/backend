import { migrateLatest, rollbackDatabase } from '../database';
import { RootController } from './api/RootController';
import logger from '../infrastructure/logging/logger';

export class Application {
  public async createAndRun() {
    await this.migrateDatabase();
    logger.info('DB connected and migrated');

    return new RootController().expressApp();
  }

  private async migrateDatabase() {
    try {
      //TODO: Remove before rolling out to production
      await rollbackDatabase();

      await migrateLatest();
    } catch (error) {
      logger.error('Failed to apply migrations', error);
      process.exit(1);
    }
  }
}
