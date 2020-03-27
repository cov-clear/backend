import AsyncRouter from '../AsyncRouter';
import { Request, Response } from 'express';
import { getCountries } from '../../application/service';
import { isAuthenticated } from '../middleware/isAuthenticated';

export default () => {
  const route = new AsyncRouter();

  route.get(
    '/countries',
    isAuthenticated,
    async (req: Request, res: Response) => {
      res.json(getCountries.execute()).status(200);
    }
  );

  return route.middleware();
};
