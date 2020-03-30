import database from '../../database';
import { PsqlMagicLinkRepository } from './PsqlMagicLinkRepository';
import { PsqlTestTypeRepository } from './PsqlTestTypeRepository';
import { PsqlUserRepository } from './PsqlUserRepository';
import { PsqlSharingCodeRepository } from './PsqlSharingCodeRepository';
import { PsqlAuthenticationRepository } from './PsqlAuthenticationRepository';
import { PsqlTestRepository } from './PsqlTestRepository';

export const magicLinkRepository = new PsqlMagicLinkRepository(database);
export const userRepository = new PsqlUserRepository(database);
export const testTypeRepository = new PsqlTestTypeRepository(database);
export const sharingCodeRepository = new PsqlSharingCodeRepository(database);
export const authenticationRepository = new PsqlAuthenticationRepository(
  database
);
export const testRepository = new PsqlTestRepository(database);
