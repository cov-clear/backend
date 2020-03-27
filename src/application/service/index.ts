import { GenerateAuthToken } from './GenerateAuthToken';
import { ExchangeAuthCode } from './ExchangeAuthCode';
import { CreateNewMagicLink } from './CreateNewMagicLink';
import * as config from '../../config';
import { GetExistingOrCreateNewUser } from './GetExistingOrCreateNewUser';
import { GetTestTypes } from './GetTestTypes';
import {
  magicLinkRepository,
  testTypeRepository,
} from '../../infrastructure/persistence';

export const generateAuthToken = new GenerateAuthToken(
  config.get('jwt.secret'),
  config.get('jwt.timeToLiveInHours')
);
export const createMagicLink = new CreateNewMagicLink(magicLinkRepository);

export const getExistingOrCreateNewUser = new GetExistingOrCreateNewUser();

export const exchangeAuthCode = new ExchangeAuthCode(
  magicLinkRepository,
  generateAuthToken,
  getExistingOrCreateNewUser
);

export const getTestTypes = new GetTestTypes(testTypeRepository);
