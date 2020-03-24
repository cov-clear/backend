import { PORT } from './config';
import logger from './logger';
import appLoader from './loaders';

async function main() {
  const app = await appLoader();

  app.listen(PORT, (err: any) => {
    if (err) {
      logger.error(err);
      process.exit(1);
      return;
    }
    logger.info(`App listening on ${PORT}`);
  });
}

main();
