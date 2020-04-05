import * as config from './config';
import logger from './infrastructure/logging/logger';
import { Application } from './presentation/Application';

async function main() {
  const app = await new Application().createAndRun();

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
