import { Request, Response } from 'express';
import AsyncRouter from '../AsyncRouter';
import { createMagicLink, exchangeAuthCode } from '../../application/service';
import { AuthorisationFailedError } from '../../application/service/authentication/ExchangeAuthCode';
import { ApiError, apiErrorCodes } from '../../presentation/dtos/ApiError';
import { AccessDeniedError } from '../../domain/model/AccessDeniedError';
import { ResourceNotFoundError } from '../../domain/model/ResourceNotFoundError';
import { DomainValidationError } from '../../domain/model/DomainValidationError';

export default () => {
  const route = new AsyncRouter();

  route.post('/auth/magic-links', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const magicLink = await createMagicLink.execute(email);

      res
        .json({
          code: magicLink.code.value,
          creationTime: magicLink.creationTime,
          active: magicLink.active,
        })
        .status(200);
    } catch (error) {
      handleError(error);
    }
  });

  route.post('/auth/login', async (req: Request, res: Response) => {
    try {
      const { authCode } = req.body;
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
    throw new ApiError(422, error.failureReason.toString());
  }
  if (error instanceof ResourceNotFoundError) {
    throw new ApiError(422, `${error.resourceName}.not-found`);
  }
  if (error instanceof DomainValidationError) {
    throw new ApiError(422, `invalid.${error.field}`, error.reason);
  }
  throw error;
}
