import { GenerateAuthToken } from './GenerateAuthToken';
import { GetExistingOrCreateNewUser } from '../users/GetExistingOrCreateNewUser';
import { MagicLinkCode } from '../../../domain/model/magiclink/MagicLink';
import { MagicLinkRepository } from '../../../domain/model/magiclink/MagicLinkRepository';
import { AuthenticationDetails } from '../../../domain/model/user/AuthenticationDetails';
import { AuthenticationMethod } from '../../../domain/model/user/AuthenticationMethod';
import { AuthenticationIdentifier } from '../../../domain/model/user/AuthenticationIdentifier';
import { Email } from '../../../domain/model/user/Email';

// TODO: Rename to be magic link specific
export class ExchangeAuthCode {
  constructor(
    private magicLinkRepository: MagicLinkRepository,
    private generateAuthToken: GenerateAuthToken,
    private getExistingOrCreateNewUser: GetExistingOrCreateNewUser
  ) {}

  public async execute(authCode: string) {
    const magicLink = await this.magicLinkRepository.findByCode(new MagicLinkCode(authCode));

    if (!magicLink) {
      throw new AuthorisationFailedError(AuthorisationFailureReason.AUTH_CODE_NOT_FOUND);
    }

    if (magicLink.isExpired()) {
      throw new AuthorisationFailedError(AuthorisationFailureReason.AUTH_CODE_EXPIRED);
    }

    if (!magicLink.active) {
      throw new AuthorisationFailedError(AuthorisationFailureReason.AUTH_CODE_ALREADY_USED);
    }

    const authenticationDetails = this.magicLinkAuthenticationDetails(magicLink.email);
    const user = await this.getExistingOrCreateNewUser.execute(authenticationDetails);
    const token = this.generateAuthToken.execute(user);

    magicLink.active = false;
    await this.magicLinkRepository.save(magicLink);

    return token;
  }

  private magicLinkAuthenticationDetails(email: Email): AuthenticationDetails {
    return new AuthenticationDetails(AuthenticationMethod.MAGIC_LINK, new AuthenticationIdentifier(email.value));
  }
}

export class AuthorisationFailedError extends Error {
  constructor(public failureReason: AuthorisationFailureReason) {
    super(`Failed to authorise code due to ${failureReason}`);
  }
}

// TODO: Should rename?
export enum AuthorisationFailureReason {
  AUTH_CODE_NOT_FOUND = 'AUTH_CODE_NOT_FOUND',
  AUTH_CODE_EXPIRED = 'AUTH_CODE_EXPIRED',
  AUTH_CODE_ALREADY_USED = 'AUTH_CODE_ALREADY_USED',
}
