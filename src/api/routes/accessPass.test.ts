import request from 'supertest';
import expressApp from '../../loaders/express';
import database from '../../database';
import { cleanupDatabase } from '../../test/cleanupDatabase';

import {
  userRepository,
  sharingCodeRepository,
} from '../../infrastructure/persistence';

import { UserId } from '../../domain/model/user/UserId';
import { User } from '../../domain/model/user/User';
import { Email } from '../../domain/model/user/Email';
import { SharingCode } from '../../domain/model/sharingCode/SharingCode';
import { getTokenForUser } from '../../test/authentication';

import { v4 as uuidv4 } from 'uuid';
import { aUserWithAllInformation } from '../../test/domainFactories';

describe('sharing code endpoints', () => {
  const app = expressApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe('POST /users/:id/access-passes', () => {
    it('returns 404 if userId is not authenticated user', async () => {
      const user1 = aUserWithAllInformation();
      const user2 = aUserWithAllInformation();

      await userRepository.save(user1);
      await userRepository.save(user2);

      await request(app)
        .post(`/api/v1/users/${user1.id.value}/access-passes`)
        .send({ code: uuidv4() })
        .set({ Authorization: `Bearer ${await getTokenForUser(user2)}` })
        .expect(404);
    });

    it('returns 403 if the sharing code does not exist', async () => {
      const user1 = aUserWithAllInformation();
      await userRepository.save(user1);

      await request(app)
        .post(`/api/v1/users/${user1.id.value}/access-passes`)
        .send({ code: uuidv4() })
        .set({ Authorization: `Bearer ${await getTokenForUser(user1)}` })
        .expect(403);
    });

    it('returns 403 if the sharing code has expired', async () => {
      const user1 = aUserWithAllInformation();
      const user2 = aUserWithAllInformation();

      await userRepository.save(user1);
      await userRepository.save(user2);

      const sharingCode = new SharingCode(
        user2.id,
        uuidv4(),
        new Date('1970-01-01')
      );
      sharingCodeRepository.save(sharingCode);

      await request(app)
        .post(`/api/v1/users/${user1.id.value}/access-passes`)
        .send({ code: sharingCode.code })
        .set({ Authorization: `Bearer ${await getTokenForUser(user1)}` })
        .expect(403);
    });

    it('returns 200 with the sharing code if user is found', async () => {
      const user1 = aUserWithAllInformation();
      const user2 = aUserWithAllInformation();

      await userRepository.save(user1);
      await userRepository.save(user2);

      const sharingCode = new SharingCode(user2.id, uuidv4(), new Date());
      await sharingCodeRepository.save(sharingCode);

      await request(app)
        .post(`/api/v1/users/${user1.id.value}/access-passes`)
        .send({ code: sharingCode.code })
        .set({ Authorization: `Bearer ${await getTokenForUser(user1)}` })
        .expect(200)
        .expect((response) => {
          const accessPass = response.body;
          expect(accessPass.userId).toBe(user2.id.value);
          expect(accessPass.expiryTime).toBeDefined();
        });
    });
  });
});

afterAll(() => {
  return database.destroy();
});
