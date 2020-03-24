import AsyncRouter from './AsyncRouter';
import { Request, Response } from 'express';

const api = new AsyncRouter();

api.get('/', async (req: Request, res: Response) => {
  res.json({ works: true });
});

export default api;
