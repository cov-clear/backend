import 'reflect-metadata';
import { Container } from 'typedi';

import * as config from './config';
import logger from './logger';
import { Application } from './presentation/Application';

async function main() {
  const app = await Container.get(Application).createAndRun();

  app.listen(config.get('port'), (err: any) => {
    if (err) {
      logger.error(err);
      process.exit(1);
      return;
    }

    logger.info(`App listening on ${config.get('port')}`);
  });
}

main();
