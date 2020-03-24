import { Request, Response, Router } from 'express';
import AsyncRouter from '../AsyncRouter';

export default () => {
  const route = new AsyncRouter();

  route.get('/hello', async (req: Request, res: Response) => {
    return res.json({ message: 'Hello World' }).status(200);
  });

  return route.middleware();
};
