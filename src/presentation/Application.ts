import bodyParser from 'body-parser';
import express from 'express';
import securityHeaders from 'helmet';
import { Service } from 'typedi';

import { migrateLatest, rollbackDatabase } from '../database';
import { createSeedDataForTestingPeriod } from '../database/testSeed';
import { RootController } from './api/RootController';
import logger from '../infrastructure/logging/logger';
import { Rollbar } from '../infrastructure/logging/Rollbar';

@Service()
export class Application {
  constructor(private rootController: RootController, private rollbar: Rollbar) {}

  public getExpressApp() {
    return express()
      .use(securityHeaders())
      .use(bodyParser.json())
      .use(logger.expressPlugin())
      .use('/api', this.rootController.routes())
      .use(this.rollbar.errorHandler());
  }

  public async createAndRun() {
    await this.migrateDatabase();
    logger.info('DB connected and migrated');

    return this.getExpressApp.bind(this)();
  }

  private async migrateDatabase() {
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
}
