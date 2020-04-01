import database from '../../database';
import { PsqlMagicLinkRepository } from './PsqlMagicLinkRepository';
import { MagicLink, MagicLinkCode } from '../../domain/model/magiclink/MagicLink';
import { Email } from '../../domain/model/user/Email';
import { cleanupDatabase } from '../../test/cleanupDatabase';

describe('PsqlMagicLinkRepository', () => {
  const psqlMagicLinkRepository = new PsqlMagicLinkRepository(database);

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('inserts new and retrieves a magic link', async () => {
    const magicLink = new MagicLink(new MagicLinkCode(), new Email('kostas@gmail.com'), true, new Date());
    await psqlMagicLinkRepository.save(magicLink);

    const persistedLink = await psqlMagicLinkRepository.findByCode(magicLink.code);
    expect(persistedLink).toEqual(magicLink);
  });

  it('updates existing magic link', async () => {
    const magicLink = new MagicLink(new MagicLinkCode(), new Email('kostas@gmail.com'), true, new Date());
    await psqlMagicLinkRepository.save(magicLink);

    magicLink.active = false;
    await psqlMagicLinkRepository.save(magicLink);

    const persistedLink = await psqlMagicLinkRepository.findByCode(magicLink.code);
    expect(persistedLink).toEqual(magicLink);
  });
});

afterAll(() => {
  return database.destroy();
});
