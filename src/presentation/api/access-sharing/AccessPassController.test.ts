import request from 'supertest';
import database from '../../../database';
import { cleanupDatabase } from '../../../test/cleanupDatabase';

import { sharingCodeRepository, userRepository } from '../../../infrastructure/persistence';

import { SharingCode } from '../../../domain/model/sharingCode/SharingCode';
import { getTokenForUser } from '../../../test/authentication';

import { v4 as uuidv4 } from 'uuid';
import { aUserWithAllInformation } from '../../../test/domainFactories';
import { RootController } from '../RootController';
import MockDate from 'mockdate';

describe('sharing code endpoints', () => {
  const app = new RootController().expressApp();

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

    it('returns 422 if the sharing code does not exist', async () => {
      const user1 = aUserWithAllInformation();
      await userRepository.save(user1);

      await request(app)
        .post(`/api/v1/users/${user1.id.value}/access-passes`)
        .send({ code: uuidv4() })
        .set({ Authorization: `Bearer ${await getTokenForUser(user1)}` })
        .expect(422);
    });

    it('returns 422 if the sharing code has expired', async () => {
      const user1 = aUserWithAllInformation();
      const user2 = aUserWithAllInformation();

      await userRepository.save(user1);
      await userRepository.save(user2);

      const sharingCode = new SharingCode(user2.id, 15, uuidv4(), new Date('1970-01-01'));
      await sharingCodeRepository.save(sharingCode);

      await request(app)
        .post(`/api/v1/users/${user1.id.value}/access-passes`)
        .send({ code: sharingCode.code })
        .set({ Authorization: `Bearer ${await getTokenForUser(user1)}` })
        .expect(422);
    });

    it('returns 200 with the sharing code if user is found', async () => {
      const user1 = aUserWithAllInformation();
      const user2 = aUserWithAllInformation();

      await userRepository.save(user1);
      await userRepository.save(user2);

      const sharingCode = new SharingCode(user2.id, 120, uuidv4(), new Date());
      await sharingCodeRepository.save(sharingCode);

      MockDate.set('2020-05-04T00:00:00Z');

      await request(app)
        .post(`/api/v1/users/${user1.id.value}/access-passes`)
        .send({ code: sharingCode.code })
        .set({ Authorization: `Bearer ${await getTokenForUser(user1)}` })
        .expect(200)
        .expect((response) => {
          const accessPass = response.body;
          expect(accessPass.userId).toBe(user2.id.value);
          expect(accessPass.expiryTime).toBe('2020-05-04T02:00:00.000Z');
        });
    });
  });
});

afterAll(() => {
  return database.destroy();
});
