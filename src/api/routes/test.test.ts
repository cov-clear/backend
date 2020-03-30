import request from 'supertest';
import expressApp from '../../loaders/express';
import database from '../../database';
import { cleanupDatabase } from '../../test/cleanupDatabase';

import { getTokenForUser } from '../../test/authentication';
import { TestTypeId } from '../../domain/model/testType/TestTypeId';

import { testRepository } from '../../infrastructure/persistence';
import { Test } from '../../domain/model/test/Test';
import { TestId } from '../../domain/model/test/TestId';

import { UserId } from '../../domain/model/user/UserId';
import { userRepository } from '../../infrastructure/persistence';
import { User } from '../../domain/model/user/User';
import { Email } from '../../domain/model/user/Email';

describe('test endpoints', () => {
  const app = expressApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe('GET /users/:id/tests', () => {
    it('returns 401 if user is authenticated', async () => {
      const id = new UserId();
      await request(app).get(`/api/v1/users/${id.value}/tests`).expect(401);
    });

    it('returns 200 with the existing test if user is found', async () => {
      const user = await userRepository.save(
        new User(new UserId(), new Email('harsh@example.com'))
      );

      const test_saved = await testRepository.save(
        new Test(new TestId(), user.id, new TestTypeId(), new Date())
      );

      await request(app)
        .get(`/api/v1/users/${user.id.value}/tests`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(user)}`,
        })
        .expect(200)
        .expect((response) => {
          expect(response.body[0].id).toEqual(test_saved.id.value);
        });
    });
  });
});

afterAll(() => {
  return database.destroy();
});
