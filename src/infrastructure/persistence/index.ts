import database from '../../database';
import { PsqlMagicLinkRepository } from './PsqlMagicLinkRepository';

export const magicLinkRepository = new PsqlMagicLinkRepository(database);
