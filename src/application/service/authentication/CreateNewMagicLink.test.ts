import database from '../../../database';
import { magicLinkRepository } from '../../../infrastructure/persistence';
import { LoggingEmailNotifier } from '../../../infrastructure/notifications/LoggingEmailNotifier';
import { cleanupDatabase } from '../../../test/cleanupDatabase';
import { createMagicLink } from '../index';

describe('CreateMagicLink', () => {
  let emailNotifierSpy: any;
  beforeEach(async () => {
    await cleanupDatabase();
    emailNotifierSpy = jest.spyOn(LoggingEmailNotifier.prototype, 'send');
    emailNotifierSpy.mockReset();
  });

  it('throws error if it fails to send an email', async () => {
    const emailError = new Error('Emai; failed to send');
    emailNotifierSpy.mockRejectedValueOnce(emailError);

    await expect(createMagicLink.execute('some@email.com')).rejects.toEqual(emailError);
  });

  it('creates a new magic link for a given email', async () => {
    const createdMagicLink = await createMagicLink.execute('some@email.com');

    const persistedMagicLink = await magicLinkRepository.findByCode(createdMagicLink.code);

    expect(persistedMagicLink).toEqual(createdMagicLink);
    expect(emailNotifierSpy).toBeCalledTimes(1);
  });
});

afterAll(() => {
  return database.destroy();
});
