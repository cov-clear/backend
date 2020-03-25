import { MagicLink } from './MagicLink';
import database from '../../../database';
import { PsqlMagicLinkRepository } from '../../../infrastructure/persistence/PsqlMagicLinkRepository';

export interface MagicLinkRepository {
  save(magicLink: MagicLink): Promise<MagicLink>;

  findByCode(code: string): Promise<MagicLink | undefined>;
}

export default new PsqlMagicLinkRepository(database);
