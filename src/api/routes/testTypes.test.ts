import request from 'supertest';
import database from '../../database';
import { cleanupDatabase } from '../../test/cleanupDatabase';

import { testTypeRepository } from '../../infrastructure/persistence';

import { UserId } from '../../domain/model/user/UserId';
import { persistedUserWithRoleAndPermissions } from '../../test/persistedEntities';
import { aTestType } from '../../test/domainFactories';
import { getTokenForUser } from '../../test/authentication';
import { CREATE_TEST_TYPE } from '../../domain/model/authentication/Permissions';
import { apiErrorCodes } from '../ApiError';
import { aCreateTestTypeCommand } from '../../test/apiFactories';
import { Container } from 'typedi';
import { Application } from '../../presentation/Application';

describe('test type endpoints', () => {
  const app = Container.get(Application).getExpressApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe('GET /test-types', () => {
    it('returns 401 if caller is not authenticated', async () => {
      const id = new UserId();
      await request(app).get(`/api/v1/test-types`).expect(401);
    });

    it('returns 200 with the existing test type if user is found', async () => {
      const testType = await testTypeRepository.save(aTestType('PCR', 'PCR_PERMISSION'));
      const user = await persistedUserWithRoleAndPermissions('USER', ['PCR_PERMISSION']);

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
          expect(testTypeResponse.resultsSchema).toEqual(testType.resultsSchema);
        });
    });
  });

  describe('POST /test-types', () => {
    it('returns 401 if caller is not authenticated', async () => {
      await request(app).get(`/api/v1/test-types`).expect(401);
    });

    it('returns 403 if caller does not have permission to create a test type', async () => {
      const user = await persistedUserWithRoleAndPermissions('USER', []);
      await request(app)
        .post(`/api/v1/test-types`)
        .send(aCreateTestTypeCommand())
        .set({
          Authorization: `Bearer ${await getTokenForUser(user)}`,
        })
        .expect(403);
    });

    it('returns 409 if a test type with that name already exists', async () => {
      const user = await persistedUserWithRoleAndPermissions('USER', [CREATE_TEST_TYPE]);
      const existingTestType = await testTypeRepository.save(aTestType('TEST_TYPE_NAME'));

      await request(app)
        .post(`/api/v1/test-types`)
        .send(aCreateTestTypeCommand(existingTestType.name))
        .set({
          Authorization: `Bearer ${await getTokenForUser(user)}`,
        })
        .expect(409)
        .expect((res) => {
          expect(res.body.code).toEqual(apiErrorCodes.TEST_TYPE_NAME_CONFLICT);
        });
    });

    it('returns 201 on success', async () => {
      const user = await persistedUserWithRoleAndPermissions('USER', [CREATE_TEST_TYPE]);
      const command = aCreateTestTypeCommand();

      await request(app)
        .post(`/api/v1/test-types`)
        .send(aCreateTestTypeCommand())
        .set({
          Authorization: `Bearer ${await getTokenForUser(user)}`,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.name).toEqual(command.name);
          expect(res.body.resultsSchema).toEqual(command.resultsSchema);
          expect(res.body.neededPermissionToAddResults).toEqual(command.neededPermissionToAddResults);
        });
    });
  });
});

afterAll(() => {
  return database.destroy();
});
