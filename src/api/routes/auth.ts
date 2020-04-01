import { Request, Response } from 'express';
import AsyncRouter from '../AsyncRouter';
import { createMagicLink, exchangeAuthCode } from '../../application/service';
import { AuthorisationFailedError } from '../../application/service/authentication/ExchangeAuthCode';
import { ApiError } from '../ApiError';

export default () => {
  const route = new AsyncRouter();

  route.post('/auth/magic-links', async (req: Request, res: Response) => {
    const { email } = req.body;
    const magicLink = await createMagicLink.execute(email);
    res
      .json({
        code: magicLink.code.value,
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
      handleError(error);
    }
  });

  return route.middleware();
};

function handleError(error: Error) {
  if (error instanceof AuthorisationFailedError) {
    throw new ApiError(403, error.failureReason.toString());
  }
  throw error;
}
