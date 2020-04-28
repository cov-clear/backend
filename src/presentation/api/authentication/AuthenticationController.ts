import { createMagicLink, exchangeAuthCode, createAuthenticationSession } from '../../../application/service';
import { BodyParam, JsonController, Post, UseAfter, Body } from 'routing-controllers';
import { AuthenticationErrorHandler } from './AuthenticationErrorHandler';
import { LoginCommand } from '../../commands/authentication/LoginCommand';
import * as config from '../../../config';

@JsonController('/v1/auth')
@UseAfter(AuthenticationErrorHandler)
export class AuthenticationController {
  private createMagicLink = createMagicLink;
  private exchangeAuthCode = exchangeAuthCode;
  private createAuthenticationSession = createAuthenticationSession;

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

  @Post('/sessions')
  async createNewAuthenticationSession() {
    const authSession = await this.createAuthenticationSession.execute();
    return { redirectUrl: authSession.redirectUrl };
  }

  @Post('/login')
  async oldLogin(@BodyParam('authCode') authCode: string) {
    const command: LoginCommand = {
      method: 'MAGIC_LINK',
      value: authCode,
    };
    const token = await this.exchangeAuthCode.execute(command);
    return { token };
  }

  @Post('/new-login')
  async login(@Body() command: LoginCommand) {
    const token = await this.exchangeAuthCode.execute(command);
    return { token };
  }
}
