import request from 'supertest';
import { cleanupDatabase } from '../../../test/cleanupDatabase';
import database from '../../../database';
import { getTokenForUser } from '../../../test/authentication';
import { ADMIN, USER } from '../../../domain/model/authentication/Roles';
import { VIEW_STATISTICS } from '../../../domain/model/authentication/Permissions';
import { persistedUserWithRoleAndPermissions } from '../../../test/persistedEntities';
import { RootController } from '../RootController';
import { aTest, aNewUser, anAccessPass } from '../../../test/domainFactories';
import { testRepository, userRepository, accessPassRepository } from '../../../infrastructure/persistence/index';

describe('statistics endpoints', () => {
  const app = new RootController().expressApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe('GET /statistics', () => {
    it('succesfully gets total amount of tests, users and access passes', async () => {
      const authenticatedUser = await persistedUserWithRoleAndPermissions(ADMIN, [VIEW_STATISTICS]);

      await Promise.all([
        userRepository.save(aNewUser()),

        accessPassRepository.save(anAccessPass()),
        accessPassRepository.save(anAccessPass()),
        accessPassRepository.save(anAccessPass()),

        testRepository.save(aTest()),
        testRepository.save(aTest()),
        testRepository.save(aTest()),
        testRepository.save(aTest()),
      ]);

      await request(app)
        .get('/api/v1/statistics')
        .set({
          Authorization: `Bearer ${await getTokenForUser(authenticatedUser)}`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBe(3);
          expect(res.body).toContainEqual({ label: 'Users', value: 2 });
          expect(res.body).toContainEqual({ label: 'Access passes', value: 3 });
          expect(res.body).toContainEqual({ label: 'Tests', value: 4 });
        });
    });

    it('returns 403 if authenticated user does not have the required permission', async () => {
      const authenticatedUser = await persistedUserWithRoleAndPermissions(USER, []);

      await request(app)
        .get('/api/v1/statistics')
        .set({
          Authorization: `Bearer ${await getTokenForUser(authenticatedUser)}`,
        })
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
