import { createMagicLink, exchangeAuthCode } from '../../../application/service';
import { BodyParam, JsonController, Post, UseAfter } from 'routing-controllers';
import { AuthenticationErrorHandler } from './AuthenticationErrorHandler';
import * as config from '../../../config';

@JsonController('/v1/auth')
@UseAfter(AuthenticationErrorHandler)
export class AuthenticationController {
  private createMagicLink = createMagicLink;
  private exchangeAuthCode = exchangeAuthCode;

  @Post('/magic-links')
  async createNewMagicLink(@BodyParam('email') emailValue: string) {
    const magicLink = await this.createMagicLink.execute(emailValue);

    const response: any = {
      creationTime: magicLink.creationTime,
      expirationTime: magicLink.expirationTime(),
      active: magicLink.active,
    };

    if (config.isDevelopment()) {
      response.code = magicLink.code.value;
    }
    return response;
  }

  @Post('/login')
  async login(@BodyParam('authCode') authCode: string) {
    const token = await this.exchangeAuthCode.execute(authCode);
    return { token };
  }
}
