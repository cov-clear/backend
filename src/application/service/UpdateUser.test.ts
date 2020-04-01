import database from '../../database';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { updateUser } from './index';
import { UserId } from '../../domain/model/user/UserId';
import { anApiAddress, anApiProfile } from '../../test/apiFactories';
import { userRepository } from '../../infrastructure/persistence';
import { aNewUser } from '../../test/domainFactories';
import { UpdateUserCommand } from '../../api/interface';
import { UserNotFoundError } from '../../domain/model/user/UserRepository';

describe('UpdateUser', () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('throws error if user not found', async () => {
    const userId = new UserId();
    await expect(updateUser.execute(userId.value, {})).rejects.toStrictEqual(new UserNotFoundError(userId));
  });

  it('updates profile and address correctly', async () => {
    const user = await userRepository.save(aNewUser());
    const updateCommand = {
      profile: anApiProfile(),
      address: anApiAddress(),
    } as UpdateUserCommand;

    await updateUser.execute(user.id.value, updateCommand);

    const updatedUser = await userRepository.findByUserId(user.id);

    expect(updatedUser?.profile?.firstName).toEqual(updateCommand.profile?.firstName);
    expect(updatedUser?.profile?.lastName).toEqual(updateCommand.profile?.lastName);
    expect(updatedUser?.profile?.sex).toEqual(updateCommand.profile?.sex);
    expect(updatedUser?.profile?.dateOfBirth.toString()).toEqual(updateCommand.profile?.dateOfBirth);

    expect(updatedUser?.address?.address1).toEqual(updateCommand.address?.address1);
    expect(updatedUser?.address?.address2).toEqual(updateCommand.address?.address2);
    expect(updatedUser?.address?.country?.code).toEqual(updateCommand.address?.countryCode);
    expect(updatedUser?.address?.city).toEqual(updateCommand.address?.city);
    expect(updatedUser?.address?.postcode).toEqual(updateCommand.address?.postcode);
    expect(updatedUser?.address?.region).toEqual(updateCommand.address?.region);
  });

  it('handles empty strings for optional fields correctly', async () => {
    const address = anApiAddress();
    address.region = '';
    address.address2 = '';

    const user = await userRepository.save(aNewUser());
    const updateCommand = { address } as UpdateUserCommand;

    await updateUser.execute(user.id.value, updateCommand);

    const persistedUser = await userRepository.findByUserId(user.id);

    expect(persistedUser?.address?.address2).toBeUndefined();
    expect(persistedUser?.address?.region).toBeUndefined();
  });
});

afterAll(() => {
  return database.destroy();
});
