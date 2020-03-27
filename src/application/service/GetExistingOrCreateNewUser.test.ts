import { userRepository } from '../../infrastructure/persistence';
import database from '../../database';
import { GetExistingOrCreateNewUser } from './GetExistingOrCreateNewUser';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { anEmail, aNewUser } from '../../test/domainFactories';

describe('GetExistingOrCreateNewUser', () => {
  const getExistingOrCreateNewUser = new GetExistingOrCreateNewUser(
    userRepository
  );

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('returns existing user if one already exists for email', async () => {
    const existingUser = await userRepository.save(aNewUser());

    const resultUser = await getExistingOrCreateNewUser.execute(
      existingUser.email.value
    );

    expect(resultUser).toEqual(existingUser);
  });

  it('creates a new user when one does not already exist for a given email', async () => {
    const email = anEmail();

    const resultUser = await getExistingOrCreateNewUser.execute(email.value);

    expect(resultUser).toBeDefined();
    expect(resultUser.email).toEqual(email);
  });
});

afterAll(() => {
  return database.destroy();
});
