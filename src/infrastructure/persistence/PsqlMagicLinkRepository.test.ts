import database, { cleanupDatabase, migrateLatest } from '../../database';
import { PsqlMagicLinkRepository } from './PsqlMagicLinkRepository';
import { MagicLink } from '../../domain/model/magiclink/MagicLink';
import { v4 } from 'uuid';
import { Email } from '../../domain/model/user/Email';

describe('PsqlMagicLinkRepository', () => {
  const psqlMagicLinkRepository = new PsqlMagicLinkRepository(database);

  beforeEach(async () => {
    await cleanupDatabase();
    await migrateLatest();
  });

  it('inserts new and retrieves a magic link', async () => {
    const magicLink = new MagicLink(
      v4(),
      new Email('kostas@gmail.com'),
      v4(),
      true,
      new Date()
    );
    await psqlMagicLinkRepository.save(magicLink);

    const persistedLink = await psqlMagicLinkRepository.findByCode(
      magicLink.code
    );
    expect(persistedLink).toEqual(magicLink);
  });

  it('updates existing magic link', async () => {
    const magicLink = new MagicLink(
      v4(),
      new Email('kostas@gmail.com'),
      v4(),
      true,
      new Date()
    );
    await psqlMagicLinkRepository.save(magicLink);

    magicLink.active = false;
    await psqlMagicLinkRepository.save(magicLink);

    const persistedLink = await psqlMagicLinkRepository.findByCode(
      magicLink.code
    );
    expect(persistedLink).toEqual(magicLink);
  });
});

afterAll((done) => {
  database.destroy();
  done();
});
