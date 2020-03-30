import { aNewUser } from '../../../test/domainFactories';
import { Authentication } from './Authentication';
import { AccessManagerFactory } from './AccessManager';
import { UserId } from '../user/UserId';
import { accessPassRepository } from '../../../infrastructure/persistence';

describe('AccessManager', () => {
  const accessManagerFactory = new AccessManagerFactory(accessPassRepository);

  describe('isLoggedInAsUser', () => {
    it('returns true if authenticated user is the same as the given user', () => {
      const authenticatedAs = new Authentication(aNewUser(), [], []);
      expect(
        accessManagerFactory
          .forAuthentication(authenticatedAs)
          .isLoggedInAsUser(new UserId(authenticatedAs.user.id.value))
      ).toBe(true);
    });

    it('returns false if authenticated user is not the same as test user', () => {
      const authenticatedAs = new Authentication(aNewUser(), [], []);

      expect(
        accessManagerFactory
          .forAuthentication(authenticatedAs)
          .isLoggedInAsUser(new UserId())
      ).toBe(false);
    });
  });
});
