import { Router } from 'express';
import hello from './routes/hello';
import auth from './routes/auth';
import testTypes from './routes/testTypes';
import user from './routes/user';
export default () => {
  const app = Router();
  app.use('/v1', hello());
  app.use('/v1', user());
  app.use('/v1', auth());
  app.use('/v1', testTypes());
  return app;
};
