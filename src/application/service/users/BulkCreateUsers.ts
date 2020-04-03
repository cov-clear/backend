import { CreateUserCommand } from '../../commands/users';
import { Email } from '../../../domain/model/user/Email';
import { RoleRepository } from '../../../domain/model/authentication/RoleRepository';
import { User } from '../../../domain/model/user/User';
import { UserId } from '../../../domain/model/user/UserId';
import { UserRepository } from '../../../domain/model/user/UserRepository';
import logger from '../../../logger';

export class BulkCreateUsers {
  constructor(private userRepository: UserRepository, private roleRepository: RoleRepository) {}

  public async execute(createUsersCommand: CreateUserCommand[]): Promise<User[]> {
    const roles = await this.roleRepository.findAll();
    let users: User[] = [];

    for (const userCommand of createUsersCommand) {
      const user = new User(new UserId(), new Email(userCommand.email));
      const role = roles.find((r) => r.name === userCommand.role);

      if (!role) {
        logger.info(`Invalid role: ${userCommand.role}`);
        continue;
      }

      user.assignRole(role, user.id);
      await this.userRepository.save(user);

      users.push(user);
    }

    return users;
  }
}
