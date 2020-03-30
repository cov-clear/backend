import request from 'supertest';
import expressApp from '../../loaders/express';
import database from '../../database';
import { cleanupDatabase } from '../../test/cleanupDatabase';

import { testTypeRepository } from '../../infrastructure/persistence';

import { UserId } from '../../domain/model/user/UserId';
import { persistedUserWithRoleAndPermissions } from '../../test/persistedEntities';
import { aTestType } from '../../test/domainFactories';
import { getTokenForUser } from '../../test/authentication';

describe('test type endpoints', () => {
  const app = expressApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe('GET /test-types', () => {
    it('returns 401 if caller is not authenticated', async () => {
      const id = new UserId();
      await request(app).get(`/api/v1/test-types`).expect(401);
    });

    it('returns 200 with the existing test type if user is found', async () => {
      const testType = await testTypeRepository.save(
        aTestType('PCR', 'PCR_PERMISSION')
      );
      const user = await persistedUserWithRoleAndPermissions('USER', [
        'PCR_PERMISSION',
      ]);

      await request(app)
        .get(`/api/v1/test-types`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(user)}`,
        })
        .expect(200)
        .expect((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          const [testTypeResponse] = response.body;
          expect(testTypeResponse.id).toEqual(testType.id.value);
          expect(testTypeResponse.name).toEqual(testType.name);
          expect(testTypeResponse.resultsSchema).toEqual(
            testType.resultsSchema
          );
        });
    });
  });
});

afterAll(() => {
  return database.destroy();
});
