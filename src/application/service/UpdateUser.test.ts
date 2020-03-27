import database from '../../database';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { updateUser } from './index';
import { UserId } from '../../domain/model/user/UserId';
import { UserNotFoundError } from './UpdateUser';
import { anApiAddress, anApiProfile } from '../../test/apiFactories';
import { userRepository } from '../../infrastructure/persistence';
import { aNewUser } from '../../test/domainFactories';
import { UpdateUserCommand } from '../../api/interface';

describe('UpdateUser', () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('throws error if user not found', async () => {
    const userId = new UserId();
    await expect(updateUser.execute(userId.value, {})).rejects.toStrictEqual(
      new UserNotFoundError(userId.value)
    );
  });

  it('updates profile and address correctly', async () => {
    const user = await userRepository.save(aNewUser());
    const updateCommand = {
      profile: anApiProfile(),
      address: anApiAddress(),
    } as UpdateUserCommand;

    await updateUser.execute(user.id.value, updateCommand);

    const updatedUser = await userRepository.findByUserId(user.id);

    expect(updatedUser?.profile).toEqual(updateCommand.profile);
    expect(updatedUser?.address).toEqual(updateCommand.address);
  });
});

afterAll(() => {
  return database.destroy();
});
