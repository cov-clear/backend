import fs from 'fs';
import mailgun from 'mailgun-js';
import AWS from 'aws-sdk';

import { Email } from '../../domain/model/user/Email';
import { CreateAuthenticationSession } from './authentication/CreateAuthenticationSession';
import { GenerateAuthToken } from './authentication/GenerateAuthToken';
import { ExchangeAuthCode } from './authentication/ExchangeAuthCode';
import { Authenticate } from './authentication/Authenticate';
import { CreateNewMagicLink } from './authentication/CreateNewMagicLink';
import * as config from '../../config';
import { GetExistingOrCreateNewUser } from './users/GetExistingOrCreateNewUser';
import { BulkCreateUsers } from './users/BulkCreateUsers';
import {
  accessPassRepository,
  magicLinkRepository,
  permissionRepository,
  roleRepository,
  sharingCodeRepository,
  testTypeRepository,
  userRepository,
  testRepository,
  reportRepository,
} from '../../infrastructure/persistence';
import { DokobitAuthenticationProvider } from '../../infrastructure/idAuthentication/DokobitAuthenticationProvider';
import { GetUser } from './users/GetUser';
import { UpdateUser } from './users/UpdateUser';
import { GetCountries } from './users/GetCountries';
import { GetTestTypes } from './tests/GetTestTypes';
import { CreateSharingCode } from './access-sharing/CreateSharingCode';
import { CreateAccessPass } from './access-sharing/CreateAccessPass';

import { LoggingEmailNotifier } from '../../infrastructure/notifications/LoggingEmailNotifier';
import { MailGunEmailNotifier } from '../../infrastructure/notifications/MailGunEmailNotifier';
import { AWSEmailNotifier } from '../../infrastructure/notifications/AWSEmailNotifier';
import { CreateTest } from './tests/CreateTest';
import { GetTests } from './tests/GetTests';
import { AssignRoleToUser } from './authorization/AssignRoleToUser';

import { AccessManagerFactory } from '../../domain/model/authentication/AccessManager';

import { CreateRole } from './authorization/CreateRole';
import { CreatePermission } from './authorization/CreatePermission';
import { AssignPermissionToRole } from './authorization/AssignPermissionToRole';
import { GetRoles } from './authorization/GetRoles';
import { GetPermissions } from './authorization/GetPermissions';
import { CreateTestType } from './tests/CreateTestType';
import { AddResultsToTest } from './tests/AddResultsToTest';
import { UpdateTestType } from './tests/UpdateTestType';
import { GetReports } from './reports/GetReports';

let emailNotifier = new LoggingEmailNotifier();

switch (config.get('emailNotifier.type')) {
  case 'mailgun':
    emailNotifier = new MailGunEmailNotifier(
      new mailgun({
        apiKey: config.get('emailNotifier.mailGunConfig.apiKey'),
        domain: config.get('emailNotifier.mailGunConfig.domain'),
      })
    );
    break;
  case 'aws':
    emailNotifier = new AWSEmailNotifier(new AWS.SES({ apiVersion: '2010-12-01' }));
}

const authenticationProvider = new DokobitAuthenticationProvider();

export const accessManagerFactory = new AccessManagerFactory(accessPassRepository);

export const assignPermissionToRole = new AssignPermissionToRole(roleRepository, permissionRepository);

export const assignRoleToUser = new AssignRoleToUser(userRepository, roleRepository);

export const getCountries = new GetCountries();

export const generateAuthToken = new GenerateAuthToken(config.get('jwt.secret'), config.get('jwt.timeToLiveInHours'));

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
  fs.readFileSync(__dirname + '/../../../assets/emails/magic-link.html').toString()
);

export const getUser = new GetUser(userRepository);

export const updateUser = new UpdateUser(userRepository);

export const getExistingOrCreateNewUser = new GetExistingOrCreateNewUser(
  userRepository,
  roleRepository,
  config.get('app.setupModeEnabled')
);

export const bulkCreateUsers = new BulkCreateUsers(userRepository, roleRepository);

export const createAuthenticationSession = new CreateAuthenticationSession(authenticationProvider);
export const exchangeAuthCode = new ExchangeAuthCode(
  magicLinkRepository,
  generateAuthToken,
  getExistingOrCreateNewUser
);
export const authenticate = new Authenticate(exchangeAuthCode);

export const createSharingCode = new CreateSharingCode(sharingCodeRepository);
export const createAccessPass = new CreateAccessPass(accessPassRepository, sharingCodeRepository);

export const getTestTypes = new GetTestTypes(testTypeRepository);
export const updateTestType = new UpdateTestType(testTypeRepository);
export const getTests = new GetTests(testRepository);
export const addResultsToTest = new AddResultsToTest(testRepository);
export const createTest = new CreateTest(testRepository, testTypeRepository, addResultsToTest);
export const getReports = new GetReports(reportRepository);
