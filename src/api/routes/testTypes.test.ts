import request from 'supertest';
import database from '../../database';
import { cleanupDatabase } from '../../test/cleanupDatabase';

import { testTypeRepository } from '../../infrastructure/persistence';

import { persistedUserWithRoleAndPermissions } from '../../test/persistedEntities';
import { aTestType } from '../../test/domainFactories';
import { getTokenForUser } from '../../test/authentication';
import { CREATE_TEST_TYPE, UPDATE_TEST_TYPE } from '../../domain/model/authentication/Permissions';
import { apiErrorCodes } from '../ApiError';
import { aCreateTestTypeCommand } from '../../test/apiFactories';
import { Application } from '../../presentation/Application';
import { InterpretationTheme } from '../../domain/model/test/interpretation/Interpretation';
import { CreateTestTypeCommand } from '../interface';

describe('test type endpoints', () => {
  const app = new Application().getExpressApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe('GET /test-types', () => {
    it('returns 401 if caller is not authenticated', async () => {
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
          expect(res.body.interpretationRules).toEqual(command.interpretationRules);
        });
    });
  });

  describe('PATCH /test-types', () => {
    it('returns 401 if caller is not authenticated', async () => {
      const testType = await testTypeRepository.save(aTestType());
      await request(app).patch(`/api/v1/test-types/${testType.id.value}`).expect(401);
    });

    it('returns 403 if caller does not have permission to create a test type', async () => {
      const testType = await testTypeRepository.save(aTestType());
      const user = await persistedUserWithRoleAndPermissions('USER', []);
      await request(app)
        .patch(`/api/v1/test-types/${testType.id.value}`)
        .send(aCreateTestTypeCommand())
        .set({
          Authorization: `Bearer ${await getTokenForUser(user)}`,
        })
        .expect(403);
    });

    it('returns 200 with the updated test type on success', async () => {
      const user = await persistedUserWithRoleAndPermissions('USER', [UPDATE_TEST_TYPE]);
      const testType = await testTypeRepository.save(aTestType());

      const testTypeCommand: CreateTestTypeCommand = {
        name: 'NEW NAME',
        resultsSchema: {
          type: 'object',
          properties: { a: { type: 'boolean' } },
        },
        neededPermissionToAddResults: 'SOME_NEW_PERMISSION',
        interpretationRules: [
          {
            output: {
              namePattern: 'New name',
              theme: InterpretationTheme.NEUTRAL,
              propertyVariables: {},
            },
            condition: { type: 'object' },
          },
        ],
      };

      await request(app)
        .patch(`/api/v1/test-types/${testType.id.value}`)
        .send(testTypeCommand)
        .set({
          Authorization: `Bearer ${await getTokenForUser(user)}`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toEqual(testType.id.value);
          expect(res.body.name).toEqual(testTypeCommand.name);
          expect(res.body.resultsSchema).toEqual(testTypeCommand.resultsSchema);
          expect(res.body.interpretationRules).toEqual(testTypeCommand.interpretationRules);
          expect(res.body.neededPermissionToAddResults).toEqual(testTypeCommand.neededPermissionToAddResults);
        });
    });
  });
});

afterAll(() => {
  return database.destroy();
});
