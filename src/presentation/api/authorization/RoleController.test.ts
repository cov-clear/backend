import request from 'supertest';
import { cleanupDatabase } from '../../../test/cleanupDatabase';
import database from '../../../database';
import { getTokenForUser } from '../../../test/authentication';
import { permissionRepository, roleRepository, userRepository } from '../../../infrastructure/persistence';
import { aNewUser } from '../../../test/domainFactories';
import { ADMIN, USER } from '../../../domain/model/authentication/Roles';
import { ASSIGN_ROLE_TO_USER, CREATE_NEW_ROLE, LIST_ROLES } from '../../../domain/model/authentication/Permissions';
import { persistedUserWithRoleAndPermissions } from '../../../test/persistedEntities';
import { Role } from '../../../domain/model/authentication/Role';
import { RootController } from '../RootController';
import { RoleDTO } from '../../dtos/authorization/RoleDTO';
import { Permission } from '../../../domain/model/authentication/Permission';

describe('roles endpoints', () => {
  const app = new RootController().expressApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe('POST /user/:id/roles', () => {
    it('successfully assigns the designated role', async () => {
      const user = await userRepository.save(aNewUser());
      const authenticatedUser = await persistedUserWithRoleAndPermissions(ADMIN, [ASSIGN_ROLE_TO_USER]);

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
      const authenticatedUser = await persistedUserWithRoleAndPermissions(ADMIN, [CREATE_NEW_ROLE]);

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
      const authenticatedUser = await persistedUserWithRoleAndPermissions(USER, []);

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
      const authenticatedUser = await persistedUserWithRoleAndPermissions(ADMIN, [LIST_ROLES]);

      const permission = await permissionRepository.save(new Permission('SOME_NEW_PERMISSION'));
      const role = new Role('SOME_NEW_ROLE');
      role.assignPermission(permission, authenticatedUser.id);
      await roleRepository.save(role);

      await request(app)
        .get(`/api/v1/roles`)
        .set({
          Authorization: `Bearer ${await getTokenForUser(authenticatedUser)}`,
        })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          const roles = res.body as RoleDTO[];
          expect(roles.find(({ name }) => name === role.name)?.name).toEqual(role.name);
          expect(roles.find(({ name }) => name === role.name)?.permissions).toEqual([permission.name]);
        });
    });
  });
});

afterAll(() => {
  return database.destroy();
});
