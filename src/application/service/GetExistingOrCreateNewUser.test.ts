import { userRepository } from '../../infrastructure/persistence';
import database from '../../database';
import { Email } from '../../domain/model/user/Email';
import { GetExistingOrCreateNewUser } from './GetExistingOrCreateNewUser';
import { User } from '../../domain/model/user/User';
import { UserId } from '../../domain/model/user/UserId';
import { cleanupDatabase } from '../../test/cleanupDatabase';

describe('GetExistingOrCreateNewUser', () => {
  const getExistingOrCreateNewUser = new GetExistingOrCreateNewUser(
    userRepository
  );

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('returns existing user if one already exists for email', async () => {
    const email = new Email('kostas1@tw.ee');
    const existingUser = await userRepository.save(
      new User(new UserId(), email, new Date())
    );

    const resultUser = await getExistingOrCreateNewUser.execute(email.value());

    expect(resultUser).toEqual(existingUser);
  });

  it('creates a new user when one does not already exist for a given email', async () => {
    const email = new Email('kostas2@tw.ee');

    const resultUser = await getExistingOrCreateNewUser.execute(email.value());

    expect(resultUser).toBeDefined();
    expect(resultUser.email()).toEqual(email);
  });
});

afterAll((done) => {
  database.destroy().then(done);
});
