import request from 'supertest';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import database from '../../database';
import { getTokenForUser } from '../../test/authentication';
import { ADMIN, USER } from '../../domain/model/authentication/Roles';
import { BULK_CREATE_USERS } from '../../domain/model/authentication/Permissions';
import { persistedUserWithRoleAndPermissions } from '../../test/persistedEntities';
import { Application } from '../../presentation/Application';

describe('admin endpoints', () => {
  const app = new Application().getExpressApp();

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
        .send([{ email: 'mail@example.com', roles: [USER] }])
        .expect(200)
        .expect((res) => {
          expect(res.body[0].email).toEqual('mail@example.com');
        });
    });

    it('returns 403 if authenticated user does not have the required permission', async () => {
      const authenticatedUser = await persistedUserWithRoleAndPermissions(USER, []);

      await request(app)
        .post(`/api/v1/admin/users`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(authenticatedUser)}`,
        })
        .send([{ email: 'mail@example.com', roles: [USER] }])
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
