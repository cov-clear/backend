import database from '../../database';
import { magicLinkRepository } from '../../infrastructure/persistence';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { createMagicLink } from './index';

describe('CreateMagicLink', () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('creates a new magic link for a given email', async () => {
    const createdMagicLink = await createMagicLink.execute('some@email.com');

    const persistedMagicLink = await magicLinkRepository.findByCode(
      createdMagicLink.code
    );
    expect(persistedMagicLink).toEqual(createdMagicLink);
  });
});

afterAll((done) => {
  database.destroy().then(done);
});
