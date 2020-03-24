import { Router } from 'express';
import hello from './routes/hello';
import auth from './routes/auth';

export default () => {
  const app = Router();
  app.use('/v1', hello());
  app.use('/v1', auth());
  return app;
};
