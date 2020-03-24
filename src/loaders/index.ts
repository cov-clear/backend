import expressLoader from './express';
import { migrateDatabase } from './database';
import logger from '../logger';

export default async () => {
  await migrateDatabase();
  logger.info('✌️ DB loaded and connected!');

  const app = await expressLoader();
  logger.info('✌️ Express loaded');

  return app;
};
