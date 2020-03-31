import {
  aNewUser,
  aPermission,
  aRoleWithoutPermissions,
} from '../../../test/domainFactories';
import { Role } from './Role';
import { ADD_TAKE_HOME_TEST_RESULT } from './Permissions';

describe('Role', () => {
  describe('name validation', () => {
    it('Only allows capital letters and underscores', () => {
      expect(() => new Role('DOCTOR')).not.toThrow();
      expect(() => new Role('PATIENT')).not.toThrow();
      expect(() => new Role('PHARMACIST')).not.toThrow();
      expect(() => new Role('USER')).not.toThrow();
      expect(() => new Role('QUALIFIED_TESTER')).not.toThrow();

      expect(() => new Role('_CANNOT_START_WITH_UNDERSCORE')).toThrow();
      expect(() => new Role('CANNOT_END_WITH_UNDERSCORE_')).toThrow();
      expect(() => new Role('INVALID-CHARACTER')).toThrow();
      expect(() => new Role('not_lowercase')).toThrow();
    });
  });

  describe('assignPermission', () => {
    it('assigns and removes a new permission correctly', () => {
      const role = aRoleWithoutPermissions('ROLE');

      expect(role.permissions().length).toBe(0);

      const permission = aPermission(ADD_TAKE_HOME_TEST_RESULT);
      role.assignPermission(permission, aNewUser().id);

      expect(role.permissions()[0]).toEqual(permission);

      role.removePermission(permission, aNewUser().id);
      expect(role.permissions().length).toBe(0);
    });
  });
});
