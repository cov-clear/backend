import { RoleRepository } from '../../../domain/model/authentication/RoleRepository';
import { User } from '../../../domain/model/user/User';
import { UserRepository } from '../../../domain/model/user/UserRepository';
import logger from '../../../infrastructure/logging/logger';
import { CreateUserCommand } from '../../../presentation/commands/admin/CreateUserCommand';
import { AuthenticationDetails } from '../../../domain/model/user/AuthenticationDetails';
import {
  fromString as authenticationMethodTypeFromString,
  AuthenticationMethod,
} from '../../../domain/model/user/AuthenticationMethod';
import { AuthenticationIdentifier } from '../../../domain/model/user/AuthenticationIdentifier';
import log from '../../../infrastructure/logging/logger';
import { Uuid } from '../../../domain/Uuid';

export class BulkCreateUsers {
  constructor(private userRepository: UserRepository, private roleRepository: RoleRepository) {}

  public async execute(createUsersCommand: CreateUserCommand[], actor: User): Promise<User[]> {
    const roles = await this.roleRepository.findAll();
    let users: User[] = [];

    const batchId = new Uuid();

    for (const userCommand of createUsersCommand) {
      const methodType = authenticationMethodTypeFromString(userCommand.authenticationDetails.method);
      const authenticationDetails = new AuthenticationDetails(
        new AuthenticationMethod(methodType),
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

      const savedUser = await this.userRepository.save(user);

      log.info('Created user in bulk', {
        batchId: batchId.value,
        userId: savedUser.id.value,
        authenticationMethod: savedUser.authenticationDetails.method.type,
        actorId: actor.id.value,
      });

      users.push(savedUser);
    }

    return users;
  }
}
