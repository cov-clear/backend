import database from '../../database';
import { PsqlMagicLinkRepository } from './PsqlMagicLinkRepository';
import { PsqlTestTypeRepository } from './PsqlTestTypeRepository';

export const magicLinkRepository = new PsqlMagicLinkRepository(database);
export const testTypeRepository = new PsqlTestTypeRepository(database);
