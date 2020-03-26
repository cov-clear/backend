import database from '../../database';
import { PsqlUserRepository } from './PsqlUserRepository';
import { UserId } from '../../domain/model/user/UserId';
import { User } from '../../domain/model/user/User';
import { Email } from '../../domain/model/user/Email';
import { cleanupDatabase } from '../../test/cleanupDatabase';

describe('PsqlUserRepository', () => {
  const psqlUserRepository = new PsqlUserRepository(database);

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('inserts new and retrieves a user by id', async () => {
    const user = await psqlUserRepository.save(
      new User(new UserId(), new Email('kostas1@transferwise.com'))
    );

    const persistedUser = await psqlUserRepository.findByUserId(user.id());

    expect(persistedUser).toEqual(user);
  });

  it('inserts new and retrieves a user by email', async () => {
    const user = await psqlUserRepository.save(
      new User(new UserId(), new Email('kostas2@transferwise.com'))
    );

    const persistedUser = await psqlUserRepository.findByEmail(user.email());

    expect(persistedUser).toEqual(user);
  });

  it('does nothing (for now) if user already exists', async () => {
    const user = await psqlUserRepository.save(
      new User(new UserId(), new Email('kostas3@transferwise.com'))
    );
    await psqlUserRepository.save(user);

    const persistedUser = await psqlUserRepository.findByUserId(user.id());
    expect(persistedUser).toEqual(user);
  });
});

afterAll(() => {
  return database.destroy();
});
