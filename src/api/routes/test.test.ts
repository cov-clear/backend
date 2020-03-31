import request from 'supertest';
import expressApp from '../../loaders/express';
import database from '../../database';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { getTokenForUser } from '../../test/authentication';

import { v4 as uuidv4 } from 'uuid';
import { Test } from '../../domain/model/test/Test';
import { TestId } from '../../domain/model/test/TestId';
import { TestTypeId } from '../../domain/model/testType/TestTypeId';
import { UserId } from '../../domain/model/user/UserId';
import { User } from '../../domain/model/user/User';
import { Email } from '../../domain/model/user/Email';
import { AccessPass } from '../../domain/model/accessPass/AccessPass';

import {
  userRepository,
  testRepository,
  testTypeRepository,
  accessPassRepository,
} from '../../infrastructure/persistence';

import { aNewUser, aTestType, aTest } from '../../test/domainFactories';

describe('test endpoints', () => {
  const app = expressApp();

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
      const unknowUserId = new UserId();

      await request(app)
        .get(`/api/v1/users/${unknowUserId.value}/tests`)
        .set({ Authorization: `Bearer ${await getTokenForUser(user)}` })
        .expect(404);
    });

    it('returns 200 with the existing test if user is found', async () => {
      const user = await userRepository.save(aNewUser());
      const test = await testRepository.save(aTest(user.id));

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
      const test = await testRepository.save(aTest(subjectUser.id));

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
      const test = await testRepository.save(aTest(subjectUser.id));

      const accessPass = new AccessPass(
        actorUser.id,
        subjectUser.id,
        uuidv4(),
        new Date('1970-01-01')
      );

      await accessPassRepository.save(accessPass);

      await request(app)
        .get(`/api/v1/users/${subjectUser.id.value}/tests`)
        .set({ Authorization: `Bearer ${await getTokenForUser(actorUser)}` })
        .expect(404);
    });
  });

  describe('POST /users/:id/tests', () => {
    it('returns 401 if user is not authenticated', async () => {
      const userId = new UserId();
      await request(app)
        .post(`/api/v1/users/${userId.value}/tests`)
        .expect(401);
    });

    it('returns 404 if user is not found', async () => {
      const user = await userRepository.save(aNewUser());
      const unknowUserId = new UserId();

      await request(app)
        .post(`/api/v1/users/${unknowUserId.value}/tests`)
        .set({ Authorization: `Bearer ${await getTokenForUser(user)}` })
        .expect(404);
    });

    // it("returns 403 if a user with an access pass but wrong permission tries to create a test for another user", async () => {
    //   const actorUser = await userRepository.save(aNewUser());
    //   const subjectUser = await userRepository.save(aNewUser());
    //
    //   const testType = await testTypeRepository.save(aTestType());
    //   const test = await testRepository.save(aTest(subjectUser.id));
    //
    //   const accessPass = new AccessPass(actorUser.id, subjectUser.id);
    //   await accessPassRepository.save(accessPass);
    //
    //   const validTest = getValidTestCommand(testType.id, actorUser.id);
    //
    //   await request(app)
    //     .post(`/api/v1/users/${subjectUser.id.value}/tests`)
    //     .set({
    //       Authorization: `Bearer ${await getTokenForUser(actorUser)}`,
    //     })
    //     .send(validTest)
    //     .expect(403);
    // });

    it('returns 201 if a user with an access pass and permission tries to create a test for another user', async () => {
      const actorUser = await userRepository.save(aNewUser());
      // TODO give the actor the necessary permission
      const subjectUser = await userRepository.save(aNewUser());

      const testType = await testTypeRepository.save(aTestType());
      const test = await testRepository.save(aTest(subjectUser.id));

      const accessPass = new AccessPass(actorUser.id, subjectUser.id);
      await accessPassRepository.save(accessPass);

      const validTest = getValidTestCommand(testType.id, actorUser.id);

      await request(app)
        .post(`/api/v1/users/${subjectUser.id.value}/tests`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(actorUser)}`,
        })
        .send(validTest)
        .expect(201);
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
      const user = await userRepository.save(aNewUser());
      const testType = await testTypeRepository.save(aTestType());

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

    it('returns 201 with the new test if user is found', async () => {
      const user = await userRepository.save(aNewUser());
      const testType = await testTypeRepository.save(aTestType());

      const validTest = getValidTestCommand(testType.id, user.id);

      await request(app)
        .post(`/api/v1/users/${user.id.value}/tests`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(user)}`,
        })
        .send(validTest)
        .expect(201)
        .expect((response) => {
          expect(response.body.testTypeId).toEqual(validTest.testTypeId);
          expect(response.body.id).toBeDefined();
          expect(response.body.userId).toEqual(user.id.value);
          expect(response.body.creationTime).toBeDefined();
        });
    });
  });
});

function getValidTestCommand(testTypeId: TestTypeId, testerId: UserId) {
  return {
    testTypeId: testTypeId.value,
    results: {
      testerUserId: testerId.value,
      details: { c: true, igg: false, igm: true },
    },
  };
}

afterAll(() => {
  return database.destroy();
});
