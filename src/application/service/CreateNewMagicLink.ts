import { MagicLink } from '../../domain/model/magiclink/MagicLink';
import { v4 } from 'uuid';
import { Email } from '../../domain/model/user/Email';
import { MagicLinkRepository } from '../../domain/model/magiclink/MagicLinkRepository';

export class CreateNewMagicLink {
  constructor(private magicLinkRepository: MagicLinkRepository) {}

  public async execute(emailValue: string) {
    const email = new Email(emailValue);
    const magicLink = new MagicLink(v4(), email, v4());

    return this.magicLinkRepository.save(magicLink);
  }
}
