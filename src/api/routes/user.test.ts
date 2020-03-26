import request from 'supertest';
import expressApp from '../../loaders/express';
import database from '../../database';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { UserId } from '../../domain/model/user/UserId';
import { userRepository } from '../../infrastructure/persistence';
import { User } from '../../domain/model/user/User';
import { Email } from '../../domain/model/user/Email';

describe('user endpoints', () => {
  const app = expressApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe('GET /users/:id', () => {
    it('returns 404 if user is not found', async () => {
      const id = new UserId();
      await request(app).get(`/api/v1/users/${id.value()}`).expect(404);
    });

    it('returns 200 with the existing if user is found', async () => {
      const id = new UserId();

      await userRepository.save(new User(id, new Email('kostas@tw.ee')));

      await request(app)
        .get(`/api/v1/users/${id.value()}`)
        .expect(200)
        .expect((response) => {
          const user = response.body;
          expect((user.id = id.value())).toEqual(id.value());
          expect(user.creationTime).toBeDefined();
          expect(user.email).toBeDefined();
        });
    });
  });
});

afterAll((done) => {
  database.destroy().then(done);
});
