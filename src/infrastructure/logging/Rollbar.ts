import { Service } from 'typedi';
import ActualRollbar from 'rollbar';

import * as config from '../../config';

@Service()
export class Rollbar extends ActualRollbar {
  constructor() {
    super({
      accessToken: config.get('rollbar.token'),
      captureUncaught: true,
      captureUnhandledRejections: true,
      reportLevel: config.get('rollbar.level'),
    });
  }
}
