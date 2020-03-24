import { Router } from 'express';
import hello from './routes/hello';

export default () => {
  const app = Router();
  app.use('/v1', hello());
  return app;
};
