import request from 'supertest';
import expressApp from '../../loaders/express';
import database from '../../database';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { UserId } from '../../domain/model/user/UserId';
import { userRepository } from '../../infrastructure/persistence';
import { User } from '../../domain/model/user/User';
import { Email } from '../../domain/model/user/Email';
import { anAddress, aNewUser, aProfile } from '../../test/domainFactories';
import { Address as ApiAddress, Profile as ApiProfile } from '../interface';

describe('user endpoints', () => {
  const app = expressApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe('GET /users/:id', () => {
    it('returns 404 if user is not found', async () => {
      const id = new UserId();
      await request(app).get(`/api/v1/users/${id.value}`).expect(404);
    });

    it('returns 200 with the existing if user is found', async () => {
      const id = new UserId();

      await userRepository.save(new User(id, new Email('kostas@tw.ee')));

      await request(app)
        .get(`/api/v1/users/${id.value}`)
        .expect(200)
        .expect((response) => {
          const user = response.body;
          expect((user.id = id.value)).toEqual(id.value);
          expect(user.creationTime).toBeDefined();
          expect(user.email).toBeDefined();
        });
    });
  });

  describe('PATCH /users/:id', () => {
    it('updates address correctly', async () => {
      const user = await userRepository.save(aNewUser());
      const address = anAddress();

      await request(app)
        .patch(`/api/v1/users/${user.id.value}`)
        .send({
          address: {
            address1: address.address1,
            address2: address.address2,
            city: address.city,
            region: address.region,
            postcode: address.postcode,
            countryCode: address.countryCode,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.profile).toBeUndefined();
          const addressResponse = res.body.address as ApiAddress;
          expect(addressResponse).toEqual(address);
        });
    });

    it('updates profile correctly', async () => {
      const user = await userRepository.save(aNewUser());
      const profile = aProfile();

      await request(app)
        .patch(`/api/v1/users/${user.id.value}`)
        .send({
          profile: {
            firstName: profile.firstName,
            lastName: profile.lastName,
            sex: profile.sex,
            dateOfBirth: profile.dateOfBirth,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.address).toBeUndefined();
          const profileResponse = res.body.profile as ApiProfile;
          expect(profileResponse).toEqual(profile);
        });
    });
  });
});

afterAll(() => {
  return database.destroy();
});
