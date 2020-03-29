import database from '../../database';
import { PsqlMagicLinkRepository } from './PsqlMagicLinkRepository';
import { PsqlTestTypeRepository } from './PsqlTestTypeRepository';
import { PsqlUserRepository } from './PsqlUserRepository';
import { PsqlSharingCodeRepository } from './PsqlSharingCodeRepository';
import { PsqlPermissionRepository } from './PsqlPermissionRepository';
import { PsqlRoleRepository } from './PsqlRoleRepository';

export const magicLinkRepository = new PsqlMagicLinkRepository(database);
export const userRepository = new PsqlUserRepository(database);
export const testTypeRepository = new PsqlTestTypeRepository(database);
export const sharingCodeRepository = new PsqlSharingCodeRepository(database);
export const permissionRepository = new PsqlPermissionRepository(database);
export const roleRepository = new PsqlRoleRepository(database);
