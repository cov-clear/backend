import database from '../../database';
import { sharingCodeRepository } from '../../infrastructure/persistence';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { v4 as uuidv4 } from 'uuid';
import { UserId } from '../../domain/model/user/UserId';
import { SharingCode } from '../../domain/model/sharingCode/SharingCode';
import { getSharingCode } from './index';

describe('GetSharingCode', () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('finds a saved sharing code using the code', async () => {
    const sharingCode = await sharingCodeRepository.save(
      new SharingCode(new UserId())
    );

    const persistedSharingCode = await getSharingCode.byCode(sharingCode.code);

    expect(persistedSharingCode).toEqual(sharingCode);
  });
});

afterAll(() => {
  return database.destroy();
});
