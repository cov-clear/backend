import * as config from './config';
import appLoader from './loaders';
import logger from './logger';

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
