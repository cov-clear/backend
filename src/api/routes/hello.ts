import { Request, Response, Router } from 'express';
import AsyncRouter from '../AsyncRouter';

const route = new AsyncRouter();

export default (app: Router) => {
  app.use('/hello', route.middleware());

  route.get('/', async (req: Request, res: Response) => {
    return res.json({ message: 'Hello World' }).status(200);
  });
};
