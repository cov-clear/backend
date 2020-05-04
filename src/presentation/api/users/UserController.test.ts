import request from 'supertest';
import database from '../../../database';
import { cleanupDatabase } from '../../../test/cleanupDatabase';
import { UserId } from '../../../domain/model/user/UserId';
import { v4 as uuidv4 } from 'uuid';
import { accessPassRepository, userRepository } from '../../../infrastructure/persistence';
import { User } from '../../../domain/model/user/User';
import { AccessPass } from '../../../domain/model/accessPass/AccessPass';
import { CREATE_USERS } from '../../../domain/model/authentication/Permissions';
import {
  anAddress,
  aNewUser,
  aUserWithAllInformation,
  magicLinkAuthenticationDetails,
  estonianIdAuthenticationDetails,
} from '../../../test/domainFactories';
import { persistedUserWithRoleAndPermissions } from '../../../test/persistedEntities';
import { getTokenForUser } from '../../../test/authentication';
import { anApiAddress, anApiProfile } from '../../../test/apiFactories';
import { RootController } from '../RootController';
import { AuthenticationMethodType } from '../../../domain/model/user/AuthenticationMethod';

describe('user endpoints', () => {
  const app = new RootController().expressApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe('POST /users', () => {
    it('returns 403 if the actor does not have permission to create users', async () => {
      const actor = await userRepository.save(aNewUser());
      await request(app)
        .post(`/api/v1/users`)
        .set({ Authorization: `Bearer ${await getTokenForUser(actor)}` })
        .send({})
        .expect(403);
    });

    // TODO once we start rejecting auth types that do not match the environment, this should be enabled.
    // it('returns 422 if the authentication details are of the wrong type', async () => {
    //   const actor = await persistedUserWithRoleAndPermissions('TEST_ADDER', [CREATE_USERS]);
    //   const authDetails = estonianIdAuthenticationDetails();
    //   const method = authDetails!.method!.type;
    //   const identifier = authDetails!.identifier!.value;
    //
    //   const authenticationDetails = { method, identifier };
    //
    //   await request(app)
    //     .patch(`/api/v1/users`)
    //     .set({ Authorization: `Bearer ${await getTokenForUser(actor)}` })
    //     .send(authenticationDetails)
    //     .expect(422);
    // });

    describe('if the authentication details do not exist', () => {
      it('should creates a new user and return a restricted user model', async () => {
        const actor = await persistedUserWithRoleAndPermissions('TEST_ADDER', [CREATE_USERS]);
        const authDetails = magicLinkAuthenticationDetails();
        const method = authDetails!.method!.type;
        const identifier = authDetails!.identifier!.value;

        const authenticationDetails = { method, identifier };

        await request(app)
          .post(`/api/v1/users`)
          .set({ Authorization: `Bearer ${await getTokenForUser(actor)}` })
          .send({ authenticationDetails })
          .expect(201)
          .expect((res) => {
            expect(res.body.id).toBeDefined();
            expect(res.body.authenticationDetails).toBeDefined();
            expect(res.body.authenticationDetails.method).toBe(method);
            expect(res.body.authenticationDetails.identifier).toBe(identifier);
          });
      });
    });

    describe('if the authentication details already exist', () => {
      it('should return the existing user with restricted data', async () => {
        const actor = await persistedUserWithRoleAndPermissions('TEST_ADDER', [CREATE_USERS]);
        const subject = await userRepository.save(aNewUser());
        const method = subject.authenticationDetails!.method!.type;
        const identifier = subject.authenticationDetails!.identifier!.value;

        const authenticationDetails = { method, identifier };

        await request(app)
          .post(`/api/v1/users`)
          .set({ Authorization: `Bearer ${await getTokenForUser(actor)}` })
          .send({ authenticationDetails })
          .expect(201)
          .expect((res) => {
            expect(res.body.id).toBe(subject.id.value);
            expect(res.body.authenticationDetails).toBeDefined();
            expect(res.body.authenticationDetails.method).toBe(method);
            expect(res.body.authenticationDetails.identifier).toBe(identifier);

            expect(res.body.email).toBeUndefined();
            expect(res.body.creationTime).toBeUndefined();
            expect(res.body.profile).toBeUndefined();
            expect(res.body.address).toBeUndefined();
          });
      });
    });
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

      const user = await userRepository.save(new User(id, magicLinkAuthenticationDetails('kostas@example.com')));

      await request(app)
        .get(`/api/v1/users/${id.value}`)
        .set({ Authorization: `Bearer ${await getTokenForUser(user)}` })
        .expect(200)
        .expect((response) => {
          const user = response.body;
          expect(user.id).toEqual(id.value);
          expect(user.creationTime).toBeDefined();
          expect(user.authenticationDetails.method).toBe(AuthenticationMethodType.MAGIC_LINK);
          expect(user.authenticationDetails.identifier).toBe('kostas@example.com');
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

      const accessPass = new AccessPass(actorUser.id, subjectUser.id, 60, uuidv4(), new Date('1970-01-01'));

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
