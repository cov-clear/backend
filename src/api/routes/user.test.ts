import request from 'supertest';
import expressApp from '../../loaders/express';
import database from '../../database';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { UserId } from '../../domain/model/user/UserId';
import { userRepository } from '../../infrastructure/persistence';
import { User } from '../../domain/model/user/User';
import { Email } from '../../domain/model/user/Email';
import {
  anAddress,
  aNewUser,
  aUserWithAllInformation,
} from '../../test/domainFactories';
import { getTokenForUser } from '../../test/authentication';
import { anApiAddress, anApiProfile } from '../../test/apiFactories';

describe('user endpoints', () => {
  const app = expressApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe('GET /users/:id', () => {
    it('returns 404 if user is not found', async () => {
      const user = await userRepository.save(aNewUser());
      const id = new UserId();

      await request(app)
        .get(`/api/v1/users/${id.value}`)
        .set({ Authorization: `Bearer ${await getTokenForUser(user)}` })
        .expect(404);
    });

    it('returns 404 if trying to access a different user id', async () => {
      const user = await userRepository.save(aNewUser());
      const otherUser = await userRepository.save(aNewUser());

      await request(app)
        .get(`/api/v1/users/${otherUser.id.value}`)
        .set({ Authorization: `Bearer ${await getTokenForUser(user)}` })
        .expect(404);
    });

    it('returns 200 with the existing if user is found', async () => {
      const id = new UserId();

      const user = await userRepository.save(
        new User(id, new Email('kostas@example.com'))
      );

      await request(app)
        .get(`/api/v1/users/${id.value}`)
        .set({ Authorization: `Bearer ${await getTokenForUser(user)}` })
        .expect(200)
        .expect((response) => {
          const user = response.body;
          expect((user.id = id.value)).toEqual(id.value);
          expect(user.creationTime).toBeDefined();
          expect(user.email).toBeDefined();
        });
    });

    it('returns 200 with all the information for an existing user', async () => {
      const user = await userRepository.save(aUserWithAllInformation());

      await request(app)
        .get(`/api/v1/users/${user.id.value}`)
        .set({ Authorization: `Bearer ${await getTokenForUser(user)}` })
        .expect(200)
        .expect((res) => {
          const user = res.body;
          expect(user.profile).toEqual(user.profile);
          expect(user.address).toEqual(user.address);
        });
    });
  });

  describe('PATCH /users/:id', () => {
    it('returns 404 if trying to access a different user id', async () => {
      const user = await userRepository.save(aNewUser());
      const otherUser = await userRepository.save(aNewUser());
      const address = anAddress();

      await request(app)
        .patch(`/api/v1/users/${otherUser.id.value}`)
        .set({ Authorization: `Bearer ${await getTokenForUser(user)}` })
        .send({
          address: {
            address1: address.address1,
            address2: address.address2,
            city: address.city,
            region: address.region,
            postcode: address.postcode,
            countryCode: address.country.code,
          },
        })
        .expect(404);
    });

    it('updates address correctly', async () => {
      const user = await userRepository.save(aNewUser());
      const address = anApiAddress();

      await request(app)
        .patch(`/api/v1/users/${user.id.value}`)
        .set({ Authorization: `Bearer ${await getTokenForUser(user)}` })
        .send({ address })
        .expect(200)
        .expect((res) => {
          expect(res.body.profile).toBeUndefined();
          expect(res.body.address).toEqual(address);
        });
    });

    it('updates profile correctly', async () => {
      const user = await userRepository.save(aNewUser());
      const profile = anApiProfile();

      await request(app)
        .patch(`/api/v1/users/${user.id.value}`)
        .set({ Authorization: `Bearer ${await getTokenForUser(user)}` })
        .send({ profile })
        .expect(200)
        .expect((res) => {
          expect(res.body.address).toBeUndefined();
          expect(res.body.profile).toEqual(profile);
        });
    });
  });
});

afterAll(() => {
  return database.destroy();
});
