import request from 'supertest';
import expressApp from '../../loaders/express';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import database from '../../database';
import { getTokenForUser } from '../../test/authentication';
import {
  permissionRepository,
  roleRepository,
  userRepository,
} from '../../infrastructure/persistence';
import { aNewUser } from '../../test/domainFactories';
import { ADMIN, DOCTOR, USER } from '../../domain/model/authentication/Roles';
import {
  ASSIGN_PERMISSION_TO_ROLE,
  ASSIGN_ROLE_TO_USER,
  CREATE_NEW_PERMISSION,
  CREATE_NEW_ROLE,
  LIST_PERMISSIONS,
  LIST_ROLES,
} from '../../domain/model/authentication/Permissions';
import { persistedUserWithRoleAndPermissions } from '../../test/persistedEntities';
import { Role } from '../../domain/model/authentication/Role';
import { Role as ApiRole, Permission as ApiPermission } from '../interface';
import { Permission } from '../../domain/model/authentication/Permission';

describe('roles endpoints', () => {
  const app = expressApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe('POST /user/:id/roles', () => {
    it('successfully assigns the designated role', async () => {
      const user = await userRepository.save(aNewUser());
      const authenticatedUser = await persistedUserWithRoleAndPermissions(
        ADMIN,
        [ASSIGN_ROLE_TO_USER]
      );

      await request(app)
        .post(`/api/v1/users/${user.id.value}/roles`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(authenticatedUser)}`,
        })
        .send({ name: USER })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toEqual(USER);
        });
    });
  });

  describe('POST /roles', () => {
    it('successfully creates a new role', async () => {
      const newRole = 'SOME_NEW_ROLE';
      const authenticatedUser = await persistedUserWithRoleAndPermissions(
        ADMIN,
        [CREATE_NEW_ROLE]
      );

      await request(app)
        .post(`/api/v1/roles`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(authenticatedUser)}`,
        })
        .send({ name: newRole })
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toEqual(newRole);
        });
    });
  });

  describe('POST /permissions', () => {
    it('successfully creates a new permission', async () => {
      const newRole = 'SOME_NEW_PERMISSION';
      const authenticatedUser = await persistedUserWithRoleAndPermissions(
        ADMIN,
        [CREATE_NEW_PERMISSION]
      );

      await request(app)
        .post(`/api/v1/permissions`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(authenticatedUser)}`,
        })
        .send({ name: newRole })
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toEqual(newRole);
        });
    });
  });

  describe('POST /roles/:name/permissions', () => {
    it('successfully assigns the designated permission to the provided role', async () => {
      const role = await roleRepository.save(new Role(DOCTOR));
      const permission = await permissionRepository.save(
        new Permission(ASSIGN_ROLE_TO_USER)
      );
      const authenticatedUser = await persistedUserWithRoleAndPermissions(
        ADMIN,
        [ASSIGN_PERMISSION_TO_ROLE]
      );

      await request(app)
        .post(`/api/v1/roles/${role.name}/permissions`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(authenticatedUser)}`,
        })
        .send({ name: permission.name })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toEqual(permission.name);
        });
    });
  });

  describe('GET /roles', () => {
    it('returns 401 if the caller is unauthenticated', async () => {
      await request(app)
        .get(`/api/v1/roles`)
        .expect(401)
        .expect((res) => {
          expect(res.body.code).toEqual('access.unauthorized');
        });
    });

    it('returns 403 if authenticated user does not have the required permission', async () => {
      const authenticatedUser = await persistedUserWithRoleAndPermissions(
        USER,
        []
      );

      await request(app)
        .get(`/api/v1/roles`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(authenticatedUser)}`,
        })
        .expect(403)
        .expect((res) => {
          expect(res.body.code).toEqual('access.denied');
        });
    });

    it('gets all the existing roles', async () => {
      const role = await roleRepository.save(new Role('SOME_ROLE'));
      const authenticatedUser = await persistedUserWithRoleAndPermissions(
        ADMIN,
        [LIST_ROLES]
      );

      await request(app)
        .get(`/api/v1/roles`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(authenticatedUser)}`,
        })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          const roles = res.body as ApiRole[];
          expect(roles.find(({ name }) => name === ADMIN)?.name).toEqual(ADMIN);
          expect(
            roles.find(({ name }) => name === ADMIN)?.permissions
          ).toEqual([LIST_ROLES]);
        });
    });
  });

  describe('GET /permissions', () => {
    it('returns 401 if the caller is unauthenticated', async () => {
      await request(app)
        .get(`/api/v1/permissions`)
        .expect(401)
        .expect((res) => {
          expect(res.body.code).toEqual('access.unauthorized');
        });
    });

    it('returns 403 if authenticated user does not have the required permission', async () => {
      const authenticatedUser = await persistedUserWithRoleAndPermissions(
        USER,
        []
      );

      await request(app)
        .get(`/api/v1/permissions`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(authenticatedUser)}`,
        })
        .expect(403)
        .expect((res) => {
          expect(res.body.code).toEqual('access.denied');
        });
    });

    it('gets all the existing permissions', async () => {
      const permission = await permissionRepository.save(
        new Permission('SOME_PERMISSION')
      );
      const authenticatedUser = await persistedUserWithRoleAndPermissions(
        ADMIN,
        [LIST_PERMISSIONS]
      );

      await request(app)
        .get(`/api/v1/permissions`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(authenticatedUser)}`,
        })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          const permissions = res.body as ApiPermission[];
          expect(
            permissions.find(({ name }) => name === permission.name)
          ).toBeDefined();
        });
    });
  });
});

afterAll(() => {
  return database.destroy();
});
