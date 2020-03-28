import { MagicLinkRepository } from '../../domain/model/magiclink/MagicLinkRepository';
import { GenerateAuthToken } from './GenerateAuthToken';
import { GetExistingOrCreateNewUser } from './GetExistingOrCreateNewUser';
import { MagicLinkCode } from '../../domain/model/magiclink/MagicLink';

export class ExchangeAuthCode {
  constructor(
    private magicLinkRepository: MagicLinkRepository,
    private generateAuthToken: GenerateAuthToken,
    private getExistingOrCreateNewUser: GetExistingOrCreateNewUser
  ) {}

  public async execute(authCode: string) {
    const magicLink = await this.magicLinkRepository.findByCode(
      new MagicLinkCode(authCode)
    );

    if (!magicLink) {
      throw new AuthorisationFailedError(
        AuthorisationFailureReason.AUTH_CODE_NOT_FOUND
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

    const user = await this.getExistingOrCreateNewUser.execute(
      magicLink.email.value
    );
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
  AUTH_CODE_NOT_FOUND = 'AUTH_CODE_NOT_FOUND',
  AUTH_CODE_EXPIRED = 'AUTH_CODE_EXPIRED',
  AUTH_CODE_ALREADY_USED = 'AUTH_CODE_ALREADY_USED',
}
