import request from 'supertest';
import expressApp from '../../loaders/express';
import database from '../../database';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { UserId } from '../../domain/model/user/UserId';
import { v4 as uuidv4 } from 'uuid';
import { userRepository, accessPassRepository } from '../../infrastructure/persistence';
import { User } from '../../domain/model/user/User';
import { Email } from '../../domain/model/user/Email';
import { AccessPass } from '../../domain/model/accessPass/AccessPass';
import { anAddress, aNewUser, aUserWithAllInformation } from '../../test/domainFactories';
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
      const actorUser = await userRepository.save(aNewUser());
      const subjectUser = await userRepository.save(aNewUser());

      await request(app)
        .get(`/api/v1/users/${subjectUser.id.value}`)
        .set({ Authorization: `Bearer ${await getTokenForUser(actorUser)}` })
        .expect(404);
    });

    it('returns 200 with the existing if user is found', async () => {
      const id = new UserId();

      const user = await userRepository.save(new User(id, new Email('kostas@example.com')));

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

    it('returns 200 if a user with an access pass requests another user', async () => {
      const actorUser = await userRepository.save(aNewUser());
      const subjectUser = await userRepository.save(aNewUser());

      await accessPassRepository.save(new AccessPass(actorUser.id, subjectUser.id));

      await request(app)
        .get(`/api/v1/users/${subjectUser.id.value}`)
        .set({ Authorization: `Bearer ${await getTokenForUser(actorUser)}` })
        .expect(200)
        .expect((res) => {
          const user = res.body;
          expect(user.id).toEqual(subjectUser.id.value);
        });
    });

    it('returns 404 if a user with an expired access pass requests another user', async () => {
      const actorUser = await userRepository.save(aNewUser());
      const subjectUser = await userRepository.save(aNewUser());

      const accessPass = new AccessPass(actorUser.id, subjectUser.id, uuidv4(), new Date('1970-01-01'));

      await accessPassRepository.save(accessPass);

      await request(app)
        .get(`/api/v1/users/${subjectUser.id.value}`)
        .set({ Authorization: `Bearer ${await getTokenForUser(actorUser)}` })
        .expect(404);
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

    it('returns 403 if a user with an access pass attempts to edit this user', async () => {
      const actorUser = await userRepository.save(aNewUser());
      const subjectUser = await userRepository.save(aNewUser());
      const address = anApiAddress();

      await accessPassRepository.save(new AccessPass(actorUser.id, subjectUser.id));

      await request(app)
        .patch(`/api/v1/users/${subjectUser.id.value}`)
        .set({ Authorization: `Bearer ${await getTokenForUser(actorUser)}` })
        .send({ address })
        .expect(403);
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

    it('accepts address with no region and address2', async () => {
      const user = await userRepository.save(aNewUser());
      const address = anApiAddress();
      address.address2 = undefined;
      address.region = undefined;

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
