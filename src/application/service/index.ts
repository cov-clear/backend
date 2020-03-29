import mailgun from 'mailgun-js';
import { Email } from '../../domain/model/user/Email';
import { GenerateAuthToken } from './GenerateAuthToken';
import { ExchangeAuthCode } from './ExchangeAuthCode';
import { CreateNewMagicLink } from './CreateNewMagicLink';
import * as config from '../../config';
import { GetExistingOrCreateNewUser } from './GetExistingOrCreateNewUser';
import {
  magicLinkRepository,
  permissionRepository,
  roleRepository,
  sharingCodeRepository,
  testTypeRepository,
  userRepository,
} from '../../infrastructure/persistence';
import { GetUser } from './GetUser';
import { UpdateUser } from './UpdateUser';
import { GetCountries } from './GetCountries';
import { CreateSharingCode } from './CreateSharingCode';
import { GetTestTypes } from './GetTestTypes';
import { LoggingEmailNotifier } from '../../infrastructure/emails/LoggingEmailNotifier';
import { MailGunEmailNotifier } from '../../infrastructure/emails/MailGunEmailNotifier';
import { AccessManagerFactory } from '../../domain/model/authentication/AccessManager';
import { CreateRole } from './CreateRole';
import { CreatePermission } from './CreatePermission';

let emailNotifier = new LoggingEmailNotifier();

if (config.get('emailNotifier.type') === 'mailgun') {
  emailNotifier = new MailGunEmailNotifier(
    new mailgun({
      apiKey: config.get('emailNotifier.mailGunConfig.apiKey'),
      domain: config.get('emailNotifier.mailGunConfig.domain'),
    })
  );
}

export const accessManagerFactory = new AccessManagerFactory({});

export const getCountries = new GetCountries();

export const generateAuthToken = new GenerateAuthToken(
  config.get('jwt.secret'),
  config.get('jwt.timeToLiveInHours')
);

export const createRole = new CreateRole(roleRepository);

export const createPermission = new CreatePermission(permissionRepository);

export const createMagicLink = new CreateNewMagicLink(
  magicLinkRepository,
  emailNotifier,
  new Email(config.get('emailNotifier.fromEmailHeader')),
  new URL(config.get('frontend.baseUrl'))
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
