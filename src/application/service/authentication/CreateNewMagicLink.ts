import { Email } from '../../../domain/model/user/Email';
import { EmailNotifier } from '../../../domain/model/notifications/EmailNotifier';
import { MagicLink, MagicLinkCode } from '../../../domain/model/magiclink/MagicLink';
import { MagicLinkRepository } from '../../../domain/model/magiclink/MagicLinkRepository';

export class CreateNewMagicLink {
  constructor(
    private magicLinkRepository: MagicLinkRepository,
    private emailNotifier: EmailNotifier,
    private fromEmailHeader: Email,
    private frontendBaseUrl: URL,
    private emailTemplate: string
  ) {}

  public async execute(emailValue: string) {
    const magicLink = await this.magicLinkRepository.save(new MagicLink(new MagicLinkCode(), new Email(emailValue)));

    await this.emailNotifier.send(
      this.fromEmailHeader,
      magicLink.email,
      'Sign in to COV-Clear',
      this.emailTemplate
        .replace(
          /{{LINK}}/g,
          `${this.frontendBaseUrl}authentication-callback?method=MAGIC_LINK&authCode=${magicLink.code.value}`
        )
        .replace(/{{ASSETS_URL}}/g, this.frontendBaseUrl.toString())
    );

    return magicLink;
  }
}
