import bodyParser from 'body-parser';
import express from 'express';
import securityHeaders from 'helmet';

import * as config from '../config';
import { migrateLatest, rollbackDatabase } from '../database';
import { createSeedDataForTestingPeriod } from '../database/testSeed';
import { RootController } from './api/RootController';
import logger from '../infrastructure/logging/logger';
import { rollbarClient } from '../infrastructure/logging/Rollbar';

export class Application {
  public getExpressApp() {
    return express()
      .use(securityHeaders())
      .use(bodyParser.json())
      .use(logger.expressPlugin())
      .use('/api', new RootController().routes())
      .use(rollbarClient.errorHandler());
  }

  public async createAndRun() {
    await this.migrateDatabase();
    logger.info('DB connected and migrated');

    return this.getExpressApp.bind(this)();
  }

  private async migrateDatabase() {
    try {
      //TODO: Remove before rolling out to production
      if (!config.isDevelopment) {
        await rollbackDatabase();
      }

      await migrateLatest();

      //TODO: Remove before rolling out to production
      if (!config.isDevelopment) {
        await createSeedDataForTestingPeriod();
      }
    } catch (error) {
      logger.error('Failed to apply migrations', error);
      process.exit(1);
    }
  }
}
