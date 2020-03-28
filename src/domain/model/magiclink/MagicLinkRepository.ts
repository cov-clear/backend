import { MagicLink, MagicLinkCode } from './MagicLink';

export interface MagicLinkRepository {
  save(magicLink: MagicLink): Promise<MagicLink>;

  findByCode(code: MagicLinkCode): Promise<MagicLink | null>;
}
