import fs from 'fs';
import mailgun from 'mailgun-js';

import { Email } from '../../domain/model/user/Email';
import { GenerateAuthToken } from './GenerateAuthToken';
import { ExchangeAuthCode } from './ExchangeAuthCode';
import { CreateNewMagicLink } from './CreateNewMagicLink';
import * as config from '../../config';
import { GetExistingOrCreateNewUser } from './GetExistingOrCreateNewUser';
import {
  accessPassRepository,
  magicLinkRepository,
  permissionRepository,
  roleRepository,
  sharingCodeRepository,
  testTypeRepository,
  userRepository,
  testRepository,
} from '../../infrastructure/persistence';
import { GetUser } from './GetUser';
import { UpdateUser } from './UpdateUser';
import { GetCountries } from './GetCountries';
import { GetTestTypes } from './GetTestTypes';
import { CreateSharingCode } from './CreateSharingCode';
import { CreateAccessPass } from './CreateAccessPass';

import { LoggingEmailNotifier } from '../../infrastructure/emails/LoggingEmailNotifier';
import { MailGunEmailNotifier } from '../../infrastructure/emails/MailGunEmailNotifier';
import { CreateTest } from './CreateTest';
import { GetTests } from './GetTests';
import { AssignRoleToUser } from './AssignRoleToUser';

import { AccessManagerFactory } from '../../domain/model/authentication/AccessManager';
import { ResultsFactory } from '../../domain/model/test/Results';

import { CreateRole } from './CreateRole';
import { CreatePermission } from './CreatePermission';
import { AssignPermissionToRole } from './AssignPermissionToRole';
import { GetRoles } from './GetRoles';
import { GetPermissions } from './GetPermissions';
import { CreateTestType } from './CreateTestType';

let emailNotifier = new LoggingEmailNotifier();

if (config.get('emailNotifier.type') === 'mailgun') {
  emailNotifier = new MailGunEmailNotifier(
    new mailgun({
      apiKey: config.get('emailNotifier.mailGunConfig.apiKey'),
      domain: config.get('emailNotifier.mailGunConfig.domain'),
    })
  );
}
export const accessManagerFactory = new AccessManagerFactory(
  accessPassRepository
);

export const assignPermissionToRole = new AssignPermissionToRole(
  roleRepository,
  permissionRepository
);

export const assignRoleToUser = new AssignRoleToUser(
  userRepository,
  roleRepository
);

export const getCountries = new GetCountries();

export const generateAuthToken = new GenerateAuthToken(
  config.get('jwt.secret'),
  config.get('jwt.timeToLiveInHours')
);

export const getRoles = new GetRoles(roleRepository);

export const getPermissions = new GetPermissions(permissionRepository);

export const createTestType = new CreateTestType(testTypeRepository);

export const createRole = new CreateRole(roleRepository);

export const createPermission = new CreatePermission(permissionRepository);

export const createMagicLink = new CreateNewMagicLink(
  magicLinkRepository,
  emailNotifier,
  new Email(config.get('emailNotifier.fromEmailHeader')),
  new URL(config.get('frontend.baseUrl')),
  fs
    .readFileSync(__dirname + '/../../../assets/emails/magic-link.html')
    .toString()
);

export const getUser = new GetUser(userRepository);

export const updateUser = new UpdateUser(userRepository);

export const getExistingOrCreateNewUser = new GetExistingOrCreateNewUser(
  userRepository,
  roleRepository
);

export const exchangeAuthCode = new ExchangeAuthCode(
  magicLinkRepository,
  generateAuthToken,
  getExistingOrCreateNewUser
);

export const getTestTypes = new GetTestTypes(testTypeRepository);

export const createSharingCode = new CreateSharingCode(sharingCodeRepository);

export const createTest = new CreateTest(testRepository, testTypeRepository);

export const getTests = new GetTests(testRepository);
export const testResultsFactory = new ResultsFactory();

export const createAccessPass = new CreateAccessPass(
  accessPassRepository,
  sharingCodeRepository
);
