import { Router } from 'express';
import hello from './routes/hello';
import auth from './routes/auth';
import user from './routes/user';
import countries from './routes/countries';

export default () => {
  const app = Router();
  app.use('/v1', hello());
  app.use('/v1', user());
  app.use('/v1', auth());
  app.use('/v1', countries());
  return app;
};
