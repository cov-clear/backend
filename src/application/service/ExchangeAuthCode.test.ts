import MockDate from 'mockdate';
import {
  AuthorisationFailedError,
  AuthorisationFailureReason,
  ExchangeAuthCode,
} from './ExchangeAuthCode';
import { magicLinkRepository } from '../../infrastructure/persistence';
import database from '../../database';
import { v4 } from 'uuid';
import { MagicLink } from '../../domain/model/magiclink/MagicLink';
import { Email } from '../../domain/model/user/Email';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { generateAuthToken, getExistingOrCreateNewUser } from './index';

describe('ExchangeAuthCode', () => {
  const exchangeAuthCode = new ExchangeAuthCode(
    magicLinkRepository,
    generateAuthToken,
    getExistingOrCreateNewUser
  );

  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterEach(async () => {
    MockDate.reset();
  });

  it('throws error when auth code cannot be found', async () => {
    await expect(
      exchangeAuthCode.execute('kostas@email.com', v4())
    ).rejects.toEqual(
      new AuthorisationFailedError(
        AuthorisationFailureReason.AUTH_CODE_OR_EMAIL_NOT_FOUND
      )
    );
  });

  it('throws error when auth code is not associated to the same email', async () => {
    const link = await magicLinkRepository.save(
      new MagicLink(v4(), new Email('some@email.com'), v4())
    );

    await expect(
      exchangeAuthCode.execute('kostas@email.com', link.code)
    ).rejects.toEqual(
      new AuthorisationFailedError(
        AuthorisationFailureReason.AUTH_CODE_OR_EMAIL_NOT_FOUND
      )
    );
  });

  it('throws error when the magic link is expired', async () => {
    const email = new Email('kostas@tw.ee');
    const link = await magicLinkRepository.save(
      new MagicLink(v4(), email, v4())
    );

    MockDate.set(link.expirationTime().getTime() + 10);

    await expect(
      exchangeAuthCode.execute(email.value(), link.code)
    ).rejects.toEqual(
      new AuthorisationFailedError(AuthorisationFailureReason.AUTH_CODE_EXPIRED)
    );
  });

  it('throws error when the magic link has already been used', async () => {
    const email = new Email('kostas@tw.ee');
    const link = await magicLinkRepository.save(
      new MagicLink(v4(), email, v4(), false)
    );

    await expect(
      exchangeAuthCode.execute(email.value(), link.code)
    ).rejects.toEqual(
      new AuthorisationFailedError(
        AuthorisationFailureReason.AUTH_CODE_ALREADY_USED
      )
    );
  });

  it('creates a new token for a valid link', async () => {
    const email = new Email('kostas@tw.ee');
    const link = await magicLinkRepository.save(
      new MagicLink(v4(), email, v4())
    );

    const token = await exchangeAuthCode.execute(email.value(), link.code);

    await expect(token).toBeDefined();
  });
});

afterAll(() => {
  return database.destroy();
});
