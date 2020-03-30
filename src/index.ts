import * as config from './config';
import logger from './logger';
import appLoader from './loaders';

async function main() {
  const app = await appLoader();

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
