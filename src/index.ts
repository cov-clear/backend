import express, { Express } from 'express';
import securityHeaders from 'helmet';

import { PORT } from './config';
import logger from './logger';
import { errorHandling, notFoundHandling } from './errors';
import { migrateLatest } from './database';
import apiRouter from './apiRouter';

async function main() {
  const app = createApp();
  await tryMigrateDatabase();
  logger.info('Successfully migrated database');
  app.listen(PORT, () => logger.info(`App listening on ${PORT}`));
}

function createApp(): Express {
  return express()
    .use(securityHeaders())
    .use('/api', apiRouter.middleware())
    .use(notFoundHandling())
    .use(errorHandling());
}

async function tryMigrateDatabase() {
  try {
    await migrateLatest();
  } catch (e) {
    logger.error('Failed to migrate database:', e);
    process.exit(1);
  }
}

main();
