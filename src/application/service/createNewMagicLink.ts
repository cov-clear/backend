import { MagicLink } from '../../domain/model/MagicLink';
import { v4 } from 'uuid';
import { Email } from '../../domain/model/Email';
import magicLinkRepository, {
  MagicLinkRepository,
} from '../../domain/model/MagicLinkRepository';

export class CreateNewMagicLink {
  constructor(private magicLinkRepository: MagicLinkRepository) {}

  public async execute(emailValue: string) {
    const email = new Email(emailValue);
    const magicLink = new MagicLink(v4(), email, v4());

    return this.magicLinkRepository.save(magicLink);
  }
}

export const createMagicLink = new CreateNewMagicLink(magicLinkRepository);
