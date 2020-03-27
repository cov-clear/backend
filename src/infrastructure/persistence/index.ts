import database from '../../database';
import { PsqlMagicLinkRepository } from './PsqlMagicLinkRepository';
import { PsqlUserRepository } from './PsqlUserRepository';
import { PsqlSharingCodeRepository } from './PsqlSharingCodeRepository';

export const magicLinkRepository = new PsqlMagicLinkRepository(database);
export const userRepository = new PsqlUserRepository(database);
export const sharingCodeRepository = new PsqlSharingCodeRepository(database);
