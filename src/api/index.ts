import { Router } from 'express';
import hello from './routes/hello';

export default () => {
  const app = Router();
  hello(app);
  return app;
};
