import request from 'supertest';
import expressApp from '../../loaders/express';
import database from '../../database';
import { cleanupDatabase } from '../../test/cleanupDatabase';

import { sharingCodeRepository } from '../../infrastructure/persistence';
import { SharingCode } from '../../domain/model/sharingCode/SharingCode';

import { UserId } from '../../domain/model/user/UserId';
import { userRepository } from '../../infrastructure/persistence';
import { User } from '../../domain/model/user/User';
import { Email } from '../../domain/model/user/Email';

describe('sharing code endpoints', () => {
  const app = expressApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe('POST /users/:id/sharing-code', () => {
    it('returns 404 if user is not found', async () => {
      const id = new UserId();
      await request(app)
        .get(`/api/v1/users/${id.value}/sharing-code`)
        .expect(404);
    });

    it('returns 200 with the sharing code if user is found', async () => {
      const id = new UserId();
      await userRepository.save(new User(id, new Email('kostas@tw.ee')));

      await request(app)
        .post(`/api/v1/users/${id.value}/sharing-code`)
        .expect(200)
        .expect((response) => {
          const sharingCode = response.body;
          expect(sharingCode.code).toBeTruthy();
        });
    });
  });
});

afterAll(() => {
  return database.destroy();
});
