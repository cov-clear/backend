import { RoleNotFoundError, RoleRepository } from '../../../domain/model/authentication/RoleRepository';
import { User } from '../../../domain/model/user/User';
import { UserRepository } from '../../../domain/model/user/UserRepository';
import { ADMIN, USER } from '../../../domain/model/authentication/Roles';
import { AuthenticationDetails } from '../../../domain/model/user/AuthenticationDetails';

import log from '../../../infrastructure/logging/logger';

export class GetExistingOrCreateNewUser {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
    private setupModeEnabled: boolean
  ) {}

  public async execute(authenticationDetails: AuthenticationDetails, actor?: User) {
    const existingUser = await this.userRepository.findByAuthenticationDetails(authenticationDetails);

    if (existingUser) {
      this.logUserView(existingUser, actor);
      return existingUser;
    }

    const user = User.create(authenticationDetails);

    await this.assignRolesToUser(user, this.getRolesToAssign());

    const createdUser = await this.userRepository.save(user);
    this.logUserCreation(createdUser, actor);
    return createdUser;
  }

  private async assignRolesToUser(user: User, roleNames: string[]) {
    for (const roleName of roleNames) {
      const role = await this.roleRepository.findByName(roleName);
      if (!role) {
        throw new RoleNotFoundError(roleName);
      }
      user.assignRole(role, user.id);
    }
  }

  private getRolesToAssign() {
    return this.setupModeEnabled ? [USER, ADMIN] : [USER];
  }

  private logUserCreation(user: User, actor: User = user) {
    log.info('User created', {
      userId: user.id.value,
      authenticationMethod: user.authenticationDetails.method.type,
      actorId: actor.id.value,
    });
  }

  private logUserView(user: User, actor: User = user) {
    log.info('User viewed via authentication details', {
      userId: user.id.value,
      actorId: actor.id.value,
    });
  }
}
