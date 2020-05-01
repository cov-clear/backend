import request from 'supertest';
import database from '../../../database';
import { cleanupDatabase } from '../../../test/cleanupDatabase';

import { userRepository } from '../../../infrastructure/persistence';

import { UserId } from '../../../domain/model/user/UserId';
import { User } from '../../../domain/model/user/User';
import { Email } from '../../../domain/model/user/Email';
import { getTokenForUser } from '../../../test/authentication';
import { RootController } from '../RootController';
import { magicLinkAuthenticationDetails } from '../../../test/domainFactories';

describe('SharingCodeController', () => {
  const app = new RootController().expressApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe('POST /users/:id/sharing-code', () => {
    it('returns 404 if user is not found', async () => {
      const id = new UserId();
      await request(app).get(`/api/v1/users/${id.value}/sharing-code`).expect(404);
    });

    it('returns 200 with the sharing code if user is found', async () => {
      const id = new UserId();
      const user = await userRepository.save(new User(id, magicLinkAuthenticationDetails()));

      await request(app)
        .post(`/api/v1/users/${id.value}/sharing-code`)
        .set({ Authorization: `Bearer ${await getTokenForUser(user)}` })
        .expect(200)
        .expect((response) => {
          const sharingCode = response.body;
          expect(sharingCode.code).toBeDefined();
        });
    });

    it('returns 404 if trying to access a different userId', async () => {
      const id = new UserId();
      const user = await userRepository.save(new User(id, magicLinkAuthenticationDetails()));

      await request(app)
        .post(`/api/v1/users/${new UserId().value}/sharing-code`)
        .set({ Authorization: `Bearer ${await getTokenForUser(user)}` })
        .expect(404);
    });
  });
});

afterAll(() => {
  return database.destroy();
});
