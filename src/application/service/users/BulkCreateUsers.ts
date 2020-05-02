import { RoleRepository } from '../../../domain/model/authentication/RoleRepository';
import { User } from '../../../domain/model/user/User';
import { UserRepository } from '../../../domain/model/user/UserRepository';
import logger from '../../../infrastructure/logging/logger';
import { CreateUserCommand } from '../../../presentation/commands/admin/CreateUserCommand';
import { AuthenticationDetails } from '../../../domain/model/user/AuthenticationDetails';
import { fromString as authenticationMethodTypeFromString } from '../../../domain/model/user/AuthenticationMethod';
import { AuthenticationIdentifier } from '../../../domain/model/user/AuthenticationIdentifier';

export class BulkCreateUsers {
  constructor(private userRepository: UserRepository, private roleRepository: RoleRepository) {}

  public async execute(createUsersCommand: CreateUserCommand[]): Promise<User[]> {
    const roles = await this.roleRepository.findAll();
    let users: User[] = [];

    for (const userCommand of createUsersCommand) {
      const authenticationDetails = new AuthenticationDetails(
        authenticationMethodTypeFromString(userCommand.authenticationDetails.method),
        new AuthenticationIdentifier(userCommand.authenticationDetails.identifier)
      );

      let user = await this.userRepository.findByAuthenticationDetails(authenticationDetails);

      if (!user) {
        user = User.create(authenticationDetails);
      }

      for (const roleName of userCommand.roles) {
        const role = roles.find((r) => r.name === roleName);

        if (!role) {
          logger.info(`Invalid role: ${roleName}`);
          continue;
        }

        user.assignRole(role, user.id);
      }

      users.push(await this.userRepository.save(user));
    }

    return users;
  }
}
