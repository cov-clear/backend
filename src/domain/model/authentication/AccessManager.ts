import { Authentication } from './Authentication';
import { AccessPassRepository } from '../accessPass/AccessPassRepository';
import { User } from '../user/User';
import { UserId } from '../user/UserId';

export class AccessManagerFactory {
  constructor(private accessPassRepository: AccessPassRepository) {}

  forAuthentication(authentication: Authentication) {
    return new AccessManager(this.accessPassRepository, authentication);
  }

  forAuthenticatedUser(user: User) {
    return this.forAuthentication(new Authentication(user, user.roles, user.permissions));
  }
}

export class AccessManager {
  constructor(private accessPassRepository: AccessPassRepository, private authentication: Authentication) {}

  async canAccessUser(userId: UserId): Promise<boolean> {
    if (!this.authentication) {
      return false;
    }

    if (this.isLoggedInAsUser(userId)) {
      return true;
    }

    return this.hasAccessPassForUser(userId);
  }

  isLoggedInAsUser(userId: UserId): boolean {
    return !!this.authentication && this.authentication.user.id.value === userId.value;
  }

  async hasAccessPassForUser(userId: UserId): Promise<boolean> {
    const accessPass = await this.accessPassRepository.findByUserIds(this.authentication.user.id, userId);

    return !!accessPass && !accessPass.isExpired();
  }
}
