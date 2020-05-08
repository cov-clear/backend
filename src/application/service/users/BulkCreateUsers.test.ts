import { roleRepository, userRepository } from '../../../infrastructure/persistence';
import database from '../../../database';
import { BulkCreateUsers } from './BulkCreateUsers';
import { cleanupDatabase } from '../../../test/cleanupDatabase';
import { anEmail, aNewUser } from '../../../test/domainFactories';
import { USER, DOCTOR } from '../../../domain/model/authentication/Roles';
import { Role } from '../../../domain/model/authentication/Role';
import { CreateUserCommand } from '../../../presentation/commands/admin/CreateUserCommand';
import { AuthenticationDetails } from '../../../domain/model/user/AuthenticationDetails';
import { AuthenticationMethod } from '../../../domain/model/user/AuthenticationMethod';
import { AuthenticationIdentifier } from '../../../domain/model/user/AuthenticationIdentifier';
import { Email } from '../../../domain/model/user/Email';

describe('BulkCreateUsers', () => {
  const bulkCreateUsers = new BulkCreateUsers(userRepository, roleRepository);

  beforeEach(async () => {
    await cleanupDatabase();
    await roleRepository.save(new Role(DOCTOR));
  });

  it('creates users when given a set of users as a command', async () => {
    const email1 = anEmail(),
      email2 = anEmail();
    const roles1 = [DOCTOR, USER],
      roles2 = [USER];
    const command = [
      { authenticationDetails: { method: 'MAGIC_LINK', identifier: email1.value }, roles: roles1 },
      { authenticationDetails: { method: 'MAGIC_LINK', identifier: email2.value }, roles: roles2 },
    ] as CreateUserCommand[];

    const resultUsers = await bulkCreateUsers.execute(command, aNewUser());

    expect(resultUsers).toBeDefined();
    expect(resultUsers.length).toEqual(2);

    const user1 = await findByEmail(email1);
    expect(user1!.roles.sort()).toEqual(roles1.sort());

    const user2 = await findByEmail(email2);
    expect(user2!.roles.sort()).toEqual(roles2.sort());
  });

  it('it adds the new roles for an user if it already exists', async () => {
    const existingUser = await userRepository.save(aNewUser());
    const command = [
      {
        authenticationDetails: {
          method: 'MAGIC_LINK',
          identifier: existingUser.authenticationDetails.identifier.value,
        },
        roles: [DOCTOR],
      },
    ] as CreateUserCommand[];

    const resultUsers = await bulkCreateUsers.execute(command, aNewUser());
    expect(resultUsers.length).toEqual(1);

    const updatedExistingUser = await findByEmail(existingUser.authenticationDetails.identifier);

    expect(updatedExistingUser!.roles.length).toEqual(existingUser.roles.length + 1);
    expect(updatedExistingUser!.roles.sort()).toEqual([DOCTOR]);
  });
});

function findByEmail(email: Email) {
  return userRepository.findByAuthenticationDetails(
    new AuthenticationDetails(AuthenticationMethod.magicLink(), new AuthenticationIdentifier(email.value))
  );
}

afterAll(() => {
  return database.destroy();
});
