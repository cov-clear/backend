import request from 'supertest';
import database from '../../../database';
import { cleanupDatabase } from '../../../test/cleanupDatabase';
import { getTokenForUser } from '../../../test/authentication';

import { v4 as uuidv4 } from 'uuid';
import { TestTypeId } from '../../../domain/model/test/testType/TestTypeId';
import { UserId } from '../../../domain/model/user/UserId';
import { AccessPass } from '../../../domain/model/accessPass/AccessPass';

import {
  accessPassRepository,
  testRepository,
  testTypeRepository,
  userRepository,
} from '../../../infrastructure/persistence';

import { aNewUser, antibodyTestType, aResult, aTest, aTestType } from '../../../test/domainFactories';
import { persistedUserWithRoleAndPermissions } from '../../../test/persistedEntities';
import { TestId } from '../../../domain/model/test/TestId';
import { RootController } from '../RootController';
import { TestDTO } from '../../dtos/tests/TestDTO';
import { TestResultsCommand } from '../../commands/tests/TestResultsCommand';
import { TestCommand } from '../../commands/tests/TestCommand';

import { CREATE_TESTS_WITHOUT_ACCESS_PASS } from '../../../domain/model/authentication/Permissions';

describe('TestController', () => {
  const app = new RootController().expressApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe('GET /users/:id/tests', () => {
    it('returns 401 if user is not authenticated', async () => {
      const userId = new UserId();
      await request(app).get(`/api/v1/users/${userId.value}/tests`).expect(401);
    });

    it('returns 404 if user is not found', async () => {
      const user = await userRepository.save(aNewUser());
      const unknownUserId = new UserId();

      await request(app)
        .get(`/api/v1/users/${unknownUserId.value}/tests`)
        .set({ Authorization: `Bearer ${await getTokenForUser(user)}` })
        .expect(404);
    });

    it('returns 200 with the existing test if user is found', async () => {
      const user = await userRepository.save(aNewUser());
      const testType = await testTypeRepository.save(aTestType());
      const test = await testRepository.save(aTest(user.id, testType));

      await request(app)
        .get(`/api/v1/users/${user.id.value}/tests`)
        .set({ Authorization: `Bearer ${await getTokenForUser(user)}` })
        .expect(200)
        .expect((response) => {
          expect(response.body[0].id).toEqual(test.id.value);
        });
    });

    it('returns 200 if a user with an access pass requests another users tests', async () => {
      const actorUser = await userRepository.save(aNewUser());
      const subjectUser = await userRepository.save(aNewUser());
      const testType = await testTypeRepository.save(aTestType());
      const test = await testRepository.save(aTest(subjectUser.id, testType));

      const accessPass = new AccessPass(actorUser.id, subjectUser.id);
      await accessPassRepository.save(accessPass);

      await request(app)
        .get(`/api/v1/users/${subjectUser.id.value}/tests`)
        .set({ Authorization: `Bearer ${await getTokenForUser(actorUser)}` })
        .expect(200)
        .expect((response) => {
          expect(response.body[0].id).toEqual(test.id.value);
        });
    });

    it('returns 404 if a user with an expired access pass requests another users tests', async () => {
      const actorUser = await userRepository.save(aNewUser());
      const subjectUser = await userRepository.save(aNewUser());
      await testRepository.save(aTest(subjectUser.id));

      const accessPass = new AccessPass(actorUser.id, subjectUser.id, uuidv4(), new Date('1970-01-01'));

      await accessPassRepository.save(accessPass);

      await request(app)
        .get(`/api/v1/users/${subjectUser.id.value}/tests`)
        .set({ Authorization: `Bearer ${await getTokenForUser(actorUser)}` })
        .expect(404);
    });

    it('returns interpretations correctly for tests that have them', async () => {
      const actor = await persistedUserWithRoleAndPermissions('USER', []);
      const testType = await testTypeRepository.save(antibodyTestType());
      await testRepository.save(
        aTest(
          actor.id,
          testType,
          actor.id,
          aResult(actor.id, {
            c: true,
            igg: true,
            igm: false,
          })
        )
      );

      await request(app)
        .get(`/api/v1/users/${actor.id.value}/tests`)
        .set({ Authorization: `Bearer ${await getTokenForUser(actor)}` })
        .expect(200)
        .expect((res) => {
          const [test]: [TestDTO] = res.body;
          const [interpretation] = test.resultsInterpretations;

          expect(interpretation.name).toBeDefined();
          expect(interpretation.theme).toBeDefined();
        });
    });
  });

  describe('POST /users/:id/tests', () => {
    it('returns 401 if user is not authenticated', async () => {
      const userId = new UserId();
      await request(app).post(`/api/v1/users/${userId.value}/tests`).expect(401);
    });

    it('returns 404 if user is not found', async () => {
      const user = await userRepository.save(aNewUser());
      const unknownUserId = new UserId();

      await request(app)
        .post(`/api/v1/users/${unknownUserId.value}/tests`)
        .set({ Authorization: `Bearer ${await getTokenForUser(user)}` })
        .expect(404);
    });

    it('returns 403 if a user with an access pass but wrong permission tries to create a test with results for another user', async () => {
      const actorUser = await userRepository.save(aNewUser());
      const subjectUser = await userRepository.save(aNewUser());

      const testType = await testTypeRepository.save(aTestType());
      await testRepository.save(aTest(subjectUser.id));

      const accessPass = new AccessPass(actorUser.id, subjectUser.id);
      await accessPassRepository.save(accessPass);

      const validTest = getValidTestCommandWithResults(testType.id);

      await request(app)
        .post(`/api/v1/users/${subjectUser.id.value}/tests`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(actorUser)}`,
        })
        .send(validTest)
        .expect(403);
    });

    it('returns 422 if the test type does not exist', async () => {
      const user = await userRepository.save(aNewUser());
      const testType = aTestType();

      await request(app)
        .post(`/api/v1/users/${user.id.value}/tests`)
        .set({ Authorization: `Bearer ${await getTokenForUser(user)}` })
        .send({ testTypeId: testType.id.value })
        .expect(422);
    });

    it('returns 422 if there are malformed results', async () => {
      const testType = await testTypeRepository.save(aTestType());
      const user = await persistedUserWithRoleAndPermissions('USER', [testType.neededPermissionToAddResults]);

      await request(app)
        .post(`/api/v1/users/${user.id.value}/tests`)
        .set({ Authorization: `Bearer ${await getTokenForUser(user)}` })
        .send({
          testTypeId: testType.id.value,
          results: {
            testerUserId: user.id.value,
            details: { c: 12, igg: 'Wot', igm: [] },
          },
        })
        .expect(422);
    });

    it('returns 201 if a user with an access pass tries to create a test for another user', async () => {
      const testType = await testTypeRepository.save(aTestType());
      const actorUser = await persistedUserWithRoleAndPermissions('TESTER', []);
      const subjectUser = await userRepository.save(aNewUser());

      const accessPass = new AccessPass(actorUser.id, subjectUser.id);
      await accessPassRepository.save(accessPass);

      const validTest = getValidTestCommandWithNoResults(testType.id);

      await request(app)
        .post(`/api/v1/users/${subjectUser.id.value}/tests`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(actorUser)}`,
        })
        .send(validTest)
        .expect(201)
        .expect((response) => {
          expect(response.body.creator.userId).toEqual(actorUser.id.value);
          expect(response.body.creator.confidence).toBeDefined();
        });
    });

    it('returns 201 with the new test if user with the right permissions tries to create a test with results for themselves', async () => {
      const testType = await testTypeRepository.save(aTestType());
      const user = await persistedUserWithRoleAndPermissions('TESTER', [testType.neededPermissionToAddResults]);

      const validTestCommandWithResults = getValidTestCommandWithResults(testType.id);

      await request(app)
        .post(`/api/v1/users/${user.id.value}/tests`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(user)}`,
        })
        .send(validTestCommandWithResults)
        .expect(201)
        .expect((response) => {
          expect(response.body.testType.id).toEqual(validTestCommandWithResults.testTypeId);
          expect(response.body.id).toBeDefined();
          expect(response.body.userId).toEqual(user.id.value);
          expect(response.body.creator.userId).toEqual(user.id.value);
          expect(response.body.creator.confidence).toBeDefined();
          expect(response.body.creationTime).toBeDefined();
        });
    });

    it('returns 201 if a user with global test create permission tries to create a test for another user', async () => {
      const testType = await testTypeRepository.save(aTestType());
      const actorUser = await persistedUserWithRoleAndPermissions('TESTER', [CREATE_TESTS_WITHOUT_ACCESS_PASS]);
      const subjectUser = await userRepository.save(aNewUser());

      const validTest = getValidTestCommandWithNoResults(testType.id);

      await request(app)
        .post(`/api/v1/users/${subjectUser.id.value}/tests`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(actorUser)}`,
        })
        .send(validTest)
        .expect(201)
        .expect((response) => {
          expect(response.body.creator.userId).toEqual(actorUser.id.value);
          expect(response.body.creator.confidence).toBeDefined();
        });
    });
  });

  describe('PATCH /tests/:id', () => {
    it('returns 401 if the caller is not authenticated', async () => {
      await request(app).patch(`/api/v1/tests/${new TestId().value}`).send({ results: {} }).expect(401);
    });

    it('returns 404 if the test could not be found', async () => {
      const testType = await testTypeRepository.save(aTestType());
      const tester = await persistedUserWithRoleAndPermissions('TESTER', [testType.neededPermissionToAddResults]);

      await request(app)
        .patch(`/api/v1/tests/${new TestId().value}`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(tester)}`,
        })
        .send({ results: {} })
        .expect(404);
    });

    it('returns 403 if the tester does not have permission to add test results for this testType', async () => {
      const testType = await testTypeRepository.save(aTestType());
      const tester = await persistedUserWithRoleAndPermissions('TESTER', []);
      const testedUser = await persistedUserWithRoleAndPermissions('USER', []);
      const test = await testRepository.save(aTest(testedUser.id, testType));

      await request(app)
        .patch(`/api/v1/tests/${test.id.value}`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(tester)}`,
        })
        .send({ results: getValidTestResultsCommand() })
        .expect(403);
    });

    it('returns 200 if the tester has the permission to add results of this type', async () => {
      const testType = await testTypeRepository.save(aTestType());
      const tester = await persistedUserWithRoleAndPermissions('TESTER', [testType.neededPermissionToAddResults]);
      const testedUser = await persistedUserWithRoleAndPermissions('USER', []);
      const test = await testRepository.save(aTest(testedUser.id, testType));

      await request(app)
        .patch(`/api/v1/tests/${test.id.value}`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(tester)}`,
        })
        .send({ results: getValidTestResultsCommand() })
        .expect(200)
        .expect((res) => {
          expect(res.body.creator.userId).toEqual(tester.id.value);
          expect(res.body.creator.confidence).toBeDefined();
          expect(res.body.details).toEqual(getValidTestResultsCommand().details);
          expect(res.body.creationTime).toBeDefined();
        });
    });

    it('returns 200 if the tester has the permission to add results with notes', async () => {
      const testType = await testTypeRepository.save(aTestType());
      const tester = await persistedUserWithRoleAndPermissions('TESTER', [testType.neededPermissionToAddResults]);
      const testedUser = await persistedUserWithRoleAndPermissions('USER', []);
      const test = await testRepository.save(aTest(testedUser.id, testType));
      const notes =
        'The patient shows IgG levels indicating immunity to COVID-19. ' +
        'This along with regular symptom reporting the patient has done makes the patient less likely to be a carrier.';

      await request(app)
        .patch(`/api/v1/tests/${test.id.value}`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(tester)}`,
        })
        .send({ results: getValidTestResultsCommand(notes) })
        .expect(200)
        .expect((res) => {
          expect(res.body.creator.userId).toEqual(tester.id.value);
          expect(res.body.creator.confidence).toBeDefined();
          expect(res.body.details).toEqual(getValidTestResultsCommand(notes).details);
          expect(res.body.creationTime).toBeDefined();
          expect(res.body.notes).toEqual(getValidTestResultsCommand(notes).notes);
        });
    });
  });
});

function getValidTestCommandWithNoResults(testTypeId: TestTypeId): TestCommand {
  return {
    testTypeId: testTypeId.value,
  };
}

function getValidTestCommandWithResults(testTypeId: TestTypeId): TestCommand {
  return {
    testTypeId: testTypeId.value,
    results: {
      details: getValidTestResultsCommand(),
    },
  };
}

function getValidTestResultsCommand(notes?: string): TestResultsCommand {
  return {
    details: { c: true, igg: false, igm: true },
    notes: notes,
  };
}

afterAll(() => {
  return database.destroy();
});
