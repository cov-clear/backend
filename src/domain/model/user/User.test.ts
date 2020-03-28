import { aNewUser } from '../../../test/domainFactories';
import { Role } from '../authentication/Role';
import { UserId } from './UserId';
import { Permission } from '../authentication/Permission';

describe('User', () => {
  describe('assignRole', () => {
    it('assigns and removes a new role correctly', () => {
      const role = new Role('USER');
      const user = aNewUser();

      expect(user.roles).toEqual([]);

      user.assignRole(role, new UserId());
      expect(user.roles).toEqual([role.name]);

      user.removeRole(role, new UserId());
      expect(user.roles).toEqual([]);
    });

    it('returns set of permissions based on the assigned roles', () => {
      const role1 = new Role('USER');
      const role2 = new Role('DOCTOR');
      const permission1 = new Permission('PERMISSION_ONE');
      const permission2 = new Permission('PERMISSION_TWO');
      const permission3 = new Permission('PERMISSION_THREE');

      role1.assignPermission(permission1, new UserId());
      role1.assignPermission(permission2, new UserId());
      role2.assignPermission(permission2, new UserId());
      role2.assignPermission(permission3, new UserId());

      const user = aNewUser();
      expect(user.roles).toEqual([]);
      expect(user.permissions).toEqual([]);

      user.assignRole(role1, new UserId());
      user.assignRole(role2, new UserId());
      expect(user.roles.length).toEqual(2);

      expect(user.permissions.length).toEqual(3);
      expect(user.permissions).toContain(permission1.name);
      expect(user.permissions).toContain(permission2.name);
      expect(user.permissions).toContain(permission3.name);
    });
  });
});
