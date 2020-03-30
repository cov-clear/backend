import expressLoader from './express';
import { migrateDatabase } from './database';
import logger from '../logger';

export default async () => {
  await migrateDatabase();
  logger.info('DB connected and migrated');

  const app = await expressLoader();
  logger.info('Express loaded');

  return app;
};
