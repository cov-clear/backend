import { Authentication } from './Authentication';
import { UserId } from '../user/UserId';
import { AccessPassRepository } from '../accessPass/AccessPassRepository';

export class AccessManagerFactory {
  constructor(private accessPassRepository: AccessPassRepository) {}

  forAuthentication(authentication: Authentication) {
    return new AccessManager(this.accessPassRepository, authentication);
  }
}

export class AccessManager {
  constructor(
    private accessPassRepository: AccessPassRepository,
    private authentication: Authentication
  ) {}

  async canAccessUser(userId: UserId): Promise<boolean> {
    if (!this.authentication) {
      return false;
    }

    const hasAccessPass = await this.hasAccessPassForUser(userId);

    if (this.isLoggedInAsUser(userId) || hasAccessPass) {
      return true;
    }

    return false;
  }

  isLoggedInAsUser(userId: UserId): boolean {
    return (
      !!this.authentication &&
      this.authentication.user.id.value === userId.value
    );
  }

  async hasAccessPassForUser(userId: UserId): Promise<boolean> {
    console.log('actor ' + this.authentication.user.id.value);
    console.log('subject ' + userId.value);

    const accessPass = await this.accessPassRepository.findByUserIds(
      this.authentication.user.id.value,
      userId.value
    );

    return !!accessPass && !accessPass.isExpired();
  }
}
