import request from 'supertest';
import { cleanupDatabase } from '../../../test/cleanupDatabase';
import database from '../../../database';
import { getTokenForUser } from '../../../test/authentication';
import { ADMIN, USER } from '../../../domain/model/authentication/Roles';
import { BULK_CREATE_USERS } from '../../../domain/model/authentication/Permissions';
import { persistedUserWithRoleAndPermissions } from '../../../test/persistedEntities';
import { RootController } from '../RootController';

describe('service config endpoints', () => {
  const app = new RootController().expressApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe('GET /config', () => {
    it('successfully gets the config', async () => {
      const authenticatedUser = await persistedUserWithRoleAndPermissions(ADMIN, [BULK_CREATE_USERS]);

      await request(app)
        .get(`/api/v1/config`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(authenticatedUser)}`,
        })
        .send()
        .expect(200)
        .expect((res) => {
          expect(res.body.preferredAuthMethod).toBe('MAGIC_LINK');
          expect(res.body.defaultLanguage).toBe('en');
        });
    });
  });
});

afterAll(() => {
  return database.destroy();
});
