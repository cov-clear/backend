import { CreateUserCommand } from '../../../presentation/commands/users';
import { Email } from '../../../domain/model/user/Email';
import { RoleRepository } from '../../../domain/model/authentication/RoleRepository';
import { User } from '../../../domain/model/user/User';
import { UserId } from '../../../domain/model/user/UserId';
import { UserRepository } from '../../../domain/model/user/UserRepository';
import logger from '../../../infrastructure/logging/logger';

export class BulkCreateUsers {
  constructor(private userRepository: UserRepository, private roleRepository: RoleRepository) {}

  public async execute(createUsersCommand: CreateUserCommand[]): Promise<User[]> {
    const roles = await this.roleRepository.findAll();
    let users: User[] = [];

    for (const userCommand of createUsersCommand) {
      let user = await this.userRepository.findByEmail(new Email(userCommand.email));

      if (!user) {
        user = new User(new UserId(), new Email(userCommand.email));
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
