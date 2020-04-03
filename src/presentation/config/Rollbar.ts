import { Service } from 'typedi';
import Rollbar from 'rollbar';

import * as config from '../../config';

@Service()
export class RollbarConfig {
  public get() {
    return new Rollbar({
      accessToken: config.get('rollbar.token'),
      captureUncaught: true,
      captureUnhandledRejections: true,
      reportLevel: config.get('rollbar.level'),
    });
  }
}
