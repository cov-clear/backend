import database from '../../../database';
import { magicLinkRepository } from '../../../infrastructure/persistence';
import { LoggingEmailNotifier } from '../../../infrastructure/notifications/LoggingEmailNotifier';
import { cleanupDatabase } from '../../../test/cleanupDatabase';
import { createMagicLink } from '../index';

describe('CreateMagicLink', () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('creates a new magic link for a given email', async () => {
    const emailNotifierSpy = jest.spyOn(LoggingEmailNotifier.prototype, 'send');
    const createdMagicLink = await createMagicLink.execute('some@email.com');

    const persistedMagicLink = await magicLinkRepository.findByCode(createdMagicLink.code);

    expect(persistedMagicLink).toEqual(createdMagicLink);
    expect(emailNotifierSpy).toBeCalledTimes(1);
  });
});

afterAll(() => {
  return database.destroy();
});
