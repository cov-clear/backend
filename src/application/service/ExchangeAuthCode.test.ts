import MockDate from 'mockdate';
import { AuthorisationFailedError, AuthorisationFailureReason, ExchangeAuthCode } from './ExchangeAuthCode';
import { magicLinkRepository } from '../../infrastructure/persistence';
import database from '../../database';
import { MagicLink, MagicLinkCode } from '../../domain/model/magiclink/MagicLink';
import { Email } from '../../domain/model/user/Email';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { generateAuthToken, getExistingOrCreateNewUser } from './index';

describe('ExchangeAuthCode', () => {
  const exchangeAuthCode = new ExchangeAuthCode(magicLinkRepository, generateAuthToken, getExistingOrCreateNewUser);

  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterEach(async () => {
    MockDate.reset();
  });

  it('throws error when auth code cannot be found', async () => {
    await expect(exchangeAuthCode.execute(new MagicLinkCode().value)).rejects.toEqual(
      new AuthorisationFailedError(AuthorisationFailureReason.AUTH_CODE_NOT_FOUND)
    );
  });

  it('throws error when the magic link is expired', async () => {
    const email = new Email('kostas@example.com');
    const link = await magicLinkRepository.save(new MagicLink(new MagicLinkCode(), email));

    MockDate.set(link.expirationTime().getTime() + 10);

    await expect(exchangeAuthCode.execute(link.code.value)).rejects.toEqual(
      new AuthorisationFailedError(AuthorisationFailureReason.AUTH_CODE_EXPIRED)
    );
  });

  it('throws error when the magic link has already been used', async () => {
    const email = new Email('kostas@example.com');
    const link = await magicLinkRepository.save(new MagicLink(new MagicLinkCode(), email, false));

    await expect(exchangeAuthCode.execute(link.code.value)).rejects.toEqual(
      new AuthorisationFailedError(AuthorisationFailureReason.AUTH_CODE_ALREADY_USED)
    );
  });

  it('creates a new token for a valid link', async () => {
    const email = new Email('kostas@example.com');
    const link = await magicLinkRepository.save(new MagicLink(new MagicLinkCode(), email));

    const token = await exchangeAuthCode.execute(link.code.value);

    await expect(token).toBeDefined();
  });
});

afterAll(() => {
  return database.destroy();
});
