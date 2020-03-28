import { Role } from './Role';

describe('Permission', () => {
  describe('name validation', () => {
    it('Only allows capital letters and underscores', () => {
      expect(() => new Role('ADD_PCR_TEST')).not.toThrow();

      expect(() => new Role('_CANNOT_START_WITH_UNDERSCORE')).toThrow();
      expect(() => new Role('CANNOT_END_WITH_UNDERSCORE_')).toThrow();
      expect(() => new Role('INVALID-CHARACTER')).toThrow();
      expect(() => new Role('not_lowercase')).toThrow();
    });
  });
});
