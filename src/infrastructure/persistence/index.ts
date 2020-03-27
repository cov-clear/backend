import database from '../../database';
import { PsqlMagicLinkRepository } from './PsqlMagicLinkRepository';

import { PsqlTestTypeRepository } from './PsqlTestTypeRepository';
import { PsqlUserRepository } from './PsqlUserRepository';

export const magicLinkRepository = new PsqlMagicLinkRepository(database);
export const userRepository = new PsqlUserRepository(database);
export const testTypeRepository = new PsqlTestTypeRepository(database);
