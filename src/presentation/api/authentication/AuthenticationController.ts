import { createMagicLink, exchangeAuthCode } from '../../../application/service';
import { BodyParam, JsonController, Post, UseAfter } from 'routing-controllers';
import { AuthenticationErrorHandler } from './AuthenticationErrorHandler';

@JsonController('/v1/auth')
@UseAfter(AuthenticationErrorHandler)
export class AuthenticationController {
  private createMagicLink = createMagicLink;
  private exchangeAuthCode = exchangeAuthCode;

  @Post('/magic-links')
  async createNewMagicLink(@BodyParam('email') emailValue: string) {
    const magicLink = await this.createMagicLink.execute(emailValue);

    //TODO: Remove before prod launch
    return {
      code: magicLink.code.value,
      creationTime: magicLink.creationTime,
      active: magicLink.active,
    };
  }

  @Post('/login')
  async login(@BodyParam('authCode') authCode: string) {
    const token = await this.exchangeAuthCode.execute(authCode);
    return { token };
  }
}
