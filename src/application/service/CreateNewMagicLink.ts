import { Email } from '../../domain/model/user/Email';
import { EmailNotifier } from '../../domain/model/EmailNotifier';
import {
  MagicLink,
  MagicLinkCode,
} from '../../domain/model/magiclink/MagicLink';
import { MagicLinkRepository } from '../../domain/model/magiclink/MagicLinkRepository';

export class CreateNewMagicLink {
  constructor(
    private magicLinkRepository: MagicLinkRepository,
    private emailNotifier: EmailNotifier,
    private fromEmailHeader: Email,
    private frontendBaseUrl: URL
  ) {}

  public async execute(emailValue: string) {
    const magicLink = await this.magicLinkRepository.save(
      new MagicLink(new MagicLinkCode(), new Email(emailValue))
    );

    // TODO: Create the final copies and template of the email
    await this.emailNotifier.send(
      this.fromEmailHeader,
      magicLink.email,
      'Create a new account with COV-Clear',
      `Here is your link: ${this.frontendBaseUrl}link/${magicLink.code.value}`
    );

    return magicLink;
  }
}
