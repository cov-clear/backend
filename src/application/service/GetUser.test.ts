import { userRepository } from '../../infrastructure/persistence';
import database from '../../database';
import { Email } from '../../domain/model/user/Email';
import { User } from '../../domain/model/user/User';
import { UserId } from '../../domain/model/user/UserId';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { getUser } from './index';

describe('GetUser', () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe('byId', () => {
    it('returns no user if one does not exist', async () => {
      const user = await getUser.byId(new UserId().value);
      expect(user).toBeNull();
    });

    it('returns existing user', async () => {
      const id = new UserId();

      await userRepository.save(new User(id, new Email('kostas@example.com')));

      const user = await getUser.byId(id.value);

      expect(user).toBeDefined();
    });
  });
});

afterAll(() => {
  return database.destroy();
});
