import { Request, Response } from 'express';
import AsyncRouter from '../AsyncRouter';
import { createMagicLink } from '../../application/service/createNewMagicLink';

export default () => {
  const route = new AsyncRouter();

  route.post('/auth/magic-links', async (req: Request, res: Response) => {
    const { email } = req.body;
    const magicLink = await createMagicLink.execute(email);
    res
      .json({
        code: magicLink.code,
        creationTime: magicLink.creationTime,
        active: magicLink.active,
      })
      .status(200);
  });

  return route.middleware();
};
