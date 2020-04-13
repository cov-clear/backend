import { roleRepository, userRepository } from '../../../infrastructure/persistence';
import database from '../../../database';
import { GetExistingOrCreateNewUser } from './GetExistingOrCreateNewUser';
import { cleanupDatabase } from '../../../test/cleanupDatabase';
import { anEmail, aNewUser } from '../../../test/domainFactories';
import { ADMIN, USER } from '../../../domain/model/authentication/Roles';

describe('GetExistingOrCreateNewUser', () => {
  const getExistingOrCreateNewUser = new GetExistingOrCreateNewUser(userRepository, roleRepository, true);

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('returns existing user if one already exists for email', async () => {
    const existingUser = await userRepository.save(aNewUser());

    const resultUser = await getExistingOrCreateNewUser.execute(existingUser.email.value);

    expect(resultUser.id).toEqual(existingUser.id);
  });

  it('creates a new user when one does not already exist for a given email', async () => {
    const email = anEmail();

    const resultUser = await getExistingOrCreateNewUser.execute(email.value);

    expect(resultUser).toBeDefined();
    expect(resultUser.email).toEqual(email);
  });

  describe('when setup mode is enabled', () => {
    const getExistingOrCreateNewUser = new GetExistingOrCreateNewUser(userRepository, roleRepository, true);

    it('creates new users with the USER and the ADMIN role', async () => {
      const email = anEmail();

      const resultUser = await getExistingOrCreateNewUser.execute(email.value);

      expect(resultUser.roles).toContain(USER);
      expect(resultUser.roles).toContain(ADMIN);
    });
  });

  describe('when setup mode is disabled', () => {
    const getExistingOrCreateNewUser = new GetExistingOrCreateNewUser(userRepository, roleRepository, false);

    it('creates new users with only the USER role', async () => {
      const email = anEmail();

      const resultUser = await getExistingOrCreateNewUser.execute(email.value);

      expect(resultUser.roles).toContain(USER);
      expect(resultUser.roles).not.toContain(ADMIN);
    });
  });
});

afterAll(() => {
  return database.destroy();
});
