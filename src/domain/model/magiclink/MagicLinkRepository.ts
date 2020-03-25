import { MagicLink } from './MagicLink';

export interface MagicLinkRepository {
  save(magicLink: MagicLink): Promise<MagicLink>;

  findByCode(code: string): Promise<MagicLink | null>;
}
