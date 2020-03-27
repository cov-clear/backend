import { GenerateAuthToken } from './GenerateAuthToken';
import { ExchangeAuthCode } from './ExchangeAuthCode';
import { CreateNewMagicLink } from './CreateNewMagicLink';
import * as config from '../../config';
import { GetExistingOrCreateNewUser } from './GetExistingOrCreateNewUser';

import {
  magicLinkRepository,
  userRepository,
  testTypeRepository,
} from '../../infrastructure/persistence';

import { GetTestTypes } from './GetTestTypes';
import { GetUser } from './GetUser';
import { UpdateUser } from './UpdateUser';

export const generateAuthToken = new GenerateAuthToken(
  config.get('jwt.secret'),
  config.get('jwt.timeToLiveInHours')
);
export const createMagicLink = new CreateNewMagicLink(magicLinkRepository);

export const getUser = new GetUser(userRepository);

export const updateUser = new UpdateUser(userRepository);

export const getExistingOrCreateNewUser = new GetExistingOrCreateNewUser(
  userRepository
);

export const exchangeAuthCode = new ExchangeAuthCode(
  magicLinkRepository,
  generateAuthToken,
  getExistingOrCreateNewUser
);

export const getTestTypes = new GetTestTypes(testTypeRepository);
