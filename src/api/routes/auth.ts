import { Request, Response } from 'express';
import AsyncRouter from '../AsyncRouter';
import { createMagicLink, exchangeAuthCode } from '../../application/service';
import { AuthorisationFailedError } from '../../application/service/ExchangeAuthCode';

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

  route.post('/auth/login', async (req: Request, res: Response) => {
    const { authCode } = req.body;

    try {
      const token = await exchangeAuthCode.execute(authCode);
      res
        .json({
          token,
        })
        .status(200);
    } catch (error) {
      if (error instanceof AuthorisationFailedError) {
        res.status(403).json({
          code: error.failureReason.toString(),
        });
        return;
      }
      throw error;
    }
  });

  return route.middleware();
};
