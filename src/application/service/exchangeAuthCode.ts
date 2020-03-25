import jwt from 'jsonwebtoken';
import magicLinkRepository, {
  MagicLinkRepository,
} from '../../domain/model/magiclink/MagicLinkRepository';
import * as config from '../../config';
import generateAuthToken, { GenerateAuthToken } from './generateAuthToken';
import { User } from '../../domain/model/user/User';
import { v4 } from 'uuid';
import getExistingOrCreateNewUser from './getExistingOrCreateNewUser';

export class ExchangeAuthCode {
  constructor(
    private magicLinkRepository: MagicLinkRepository,
    private generateAuthToken: GenerateAuthToken
  ) {}

  public async execute(email: string, authCode: string) {
    const magicLink = await this.magicLinkRepository.findByCode(authCode);

    if (!magicLink) {
      throw new AuthorisationFailedError(
        AuthorisationFailureReason.AUTH_CODE_OR_EMAIL_NOT_FOUND
      );
    }

    if (magicLink.isExpired()) {
      throw new AuthorisationFailedError(
        AuthorisationFailureReason.AUTH_CODE_EXPIRED
      );
    }

    if (!magicLink.active) {
      throw new AuthorisationFailedError(
        AuthorisationFailureReason.AUTH_CODE_ALREADY_USED
      );
    }

    const user = await getExistingOrCreateNewUser.execute(email);
    const token = this.generateAuthToken.execute(user);

    magicLink.active = false;
    await this.magicLinkRepository.save(magicLink);

    return token;
  }
}

export class AuthorisationFailedError extends Error {
  constructor(public failureReason: AuthorisationFailureReason) {
    super(`Failed to authorise code due to ${failureReason}`);
  }
}

export enum AuthorisationFailureReason {
  AUTH_CODE_OR_EMAIL_NOT_FOUND = 'AUTH_CODE_OR_EMAIL_NOT_FOUND',
  AUTH_CODE_EXPIRED = 'AUTH_CODE_EXPIRED',
  AUTH_CODE_ALREADY_USED = 'AUTH_CODE_ALREADY_USED',
}

export const exchangeAuthCode = new ExchangeAuthCode(
  magicLinkRepository,
  generateAuthToken
);
