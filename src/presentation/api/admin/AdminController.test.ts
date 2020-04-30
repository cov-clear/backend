import request from 'supertest';
import { cleanupDatabase } from '../../../test/cleanupDatabase';
import database from '../../../database';
import { getTokenForUser } from '../../../test/authentication';
import { ADMIN, USER } from '../../../domain/model/authentication/Roles';
import { BULK_CREATE_USERS } from '../../../domain/model/authentication/Permissions';
import { persistedUserWithRoleAndPermissions } from '../../../test/persistedEntities';
import { RootController } from '../RootController';

describe('admin endpoints', () => {
  const app = new RootController().expressApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe('POST /users', () => {
    it('successfully creates new users', async () => {
      const authenticatedUser = await persistedUserWithRoleAndPermissions(ADMIN, [BULK_CREATE_USERS]);

      await request(app)
        .post(`/api/v1/admin/users`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(authenticatedUser)}`,
        })
        .send([
          {
            authenticationDetails: { method: 'MAGIC_LINK', value: 'mail@example.com' },
            roles: [USER],
          },
        ])
        .expect(201)
        .expect((res) => {
          expect(res.body[0]).toEqual('mail@example.com');
        });
    });

    it('returns 403 if authenticated user does not have the required permission', async () => {
      const authenticatedUser = await persistedUserWithRoleAndPermissions(USER, []);

      await request(app)
        .post(`/api/v1/admin/users`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(authenticatedUser)}`,
        })
        .send([
          {
            authenticationDetails: { method: 'MAGIC_LINK', value: 'mail@example.com' },
            roles: [USER],
          },
        ])
        .expect(403)
        .expect((res) => {
          expect(res.body.code).toEqual('access.denied');
        });
    });
  });
});

afterAll(() => {
  return database.destroy();
});
