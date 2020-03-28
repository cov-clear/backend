import { Authentication } from './Authentication';
import { UserId } from '../user/UserId';

export class AccessManagerFactory {
  constructor(private accessPassRepository: any) {}

  forAuthentication(authentication?: Authentication) {
    return new AccessManager(this.accessPassRepository, authentication);
  }
}

export class AccessManager {
  constructor(
    private accessPassRepository: any,
    private authentication?: Authentication
  ) {}

  //TODO: Add notion of access-passes here.
  canAccessUser(userId: UserId) {
    if (!this.authentication) {
      return false;
    }

    if (this.isLoggedInAsUser(userId)) {
      return true;
    }

    throw new Error('Not Implemented');
  }

  isLoggedInAsUser(userId: UserId) {
    return (
      !!this.authentication &&
      this.authentication.user.id.value === userId.value
    );
  }
}
