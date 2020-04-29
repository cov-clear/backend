import request from 'supertest';
import { cleanupDatabase } from '../../../test/cleanupDatabase';
import database from '../../../database';
import { getTokenForUser } from '../../../test/authentication';
import { ADMIN, USER } from '../../../domain/model/authentication/Roles';
import { VIEW_ADMIN_REPORTS } from '../../../domain/model/authentication/Permissions';
import { persistedUserWithRoleAndPermissions } from '../../../test/persistedEntities';
import { RootController } from '../RootController';
import { aTest, aTestType } from '../../../test/domainFactories';
import { testRepository, testTypeRepository } from '../../../infrastructure/persistence/index';

describe('reports endpoints', () => {
  const app = new RootController().expressApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe('GET /reports/test-results', () => {
    it('succesfully gets all test results for given test type', async () => {
      const authenticatedUser = await persistedUserWithRoleAndPermissions(ADMIN, [VIEW_ADMIN_REPORTS]);

      const testType = await testTypeRepository.save(aTestType());
      const test = await testRepository.save(aTest(authenticatedUser.id, testType));

      const testTypeIdValue = testType.id.value;

      await request(app)
        .get(`/api/v1/reports/test-results/?testTypeId=${testTypeIdValue}`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(authenticatedUser)}`,
        })
        .expect(200);
    });

    it('returns 403 if authenticated user does not have the required permission', async () => {
      const authenticatedUser = await persistedUserWithRoleAndPermissions(USER, []);
      const testType = await testTypeRepository.save(aTestType());
      const testTypeIdValue = testType.id.value;

      await request(app)
        .get(`/api/v1/reports/test-results/?testTypeId=${testTypeIdValue}`)
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
