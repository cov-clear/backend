import { userRepository } from '../../../infrastructure/persistence';
import database from '../../../database';
import { Email } from '../../../domain/model/user/Email';
import { User } from '../../../domain/model/user/User';
import { UserId } from '../../../domain/model/user/UserId';
import { cleanupDatabase } from '../../../test/cleanupDatabase';
import { getUser } from '../index';
import { UserNotFoundError } from '../../../domain/model/user/UserRepository';
import { magicLinkAuthenticationDetails } from '../../../test/domainFactories';

describe('GetUser', () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe('byId', () => {
    it('throws error if user does not exist', async () => {
      const userId = new UserId();
      await expect(getUser.byId(userId.value)).rejects.toEqual(new UserNotFoundError(userId));
    });

    it('returns existing user', async () => {
      const id = new UserId();

      await userRepository.save(new User(id, magicLinkAuthenticationDetails('kostas@example.com')));

      const user = await getUser.byId(id.value);

      expect(user).toBeDefined();
    });
  });
});

afterAll(() => {
  return database.destroy();
});
