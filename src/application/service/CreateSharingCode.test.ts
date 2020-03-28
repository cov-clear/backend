import database from '../../database';
import { sharingCodeRepository } from '../../infrastructure/persistence';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { v4 as uuidv4 } from 'uuid';
import { SharingCode } from '../../domain/model/sharingCode/SharingCode';
import { createSharingCode } from './index';

describe('CreateSharingCode', () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('creates a new sharing code with a userId', async () => {
    const persistedSharingCode: SharingCode = await createSharingCode.withUserId(
      uuidv4()
    );

    const sharingCode = await sharingCodeRepository.findByCode(
      persistedSharingCode.code
    );

    expect(sharingCode).toEqual(persistedSharingCode);
  });

  it('should fail creating a sharing code for a non existing user', async () => {
    const persistedSharingCode: SharingCode = await createSharingCode.withUserId(
      uuidv4()
    );

    const sharingCode = await sharingCodeRepository.findByCode(
      persistedSharingCode.code
    );

    expect(sharingCode).toEqual(persistedSharingCode);
  });
});

afterAll(() => {
  return database.destroy();
});
