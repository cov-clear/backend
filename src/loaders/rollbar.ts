import Rollbar from 'rollbar';
import * as config from '../config';

export const rollbar = new Rollbar({
  accessToken: config.get('rollbar.token'),
  captureUncaught: true,
  captureUnhandledRejections: true,
  reportLevel: config.get('rollbar.level'),
});
