import database from '../../database';
import { PsqlSharingCodeRepository } from './PsqlSharingCodeRepository';
import { SharingCode } from '../../domain/model/sharingCode/SharingCode';
import { v4 as uuidv4 } from 'uuid';
import { UserId } from '../../domain/model/user/UserId';
import { cleanupDatabase } from '../../test/cleanupDatabase';

describe('PsqlSharingCodeRepository', () => {
  const psqlSharingCodeRepository = new PsqlSharingCodeRepository(database);

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('inserts new and retrieves a sharing code', async () => {
    const sharingCode = new SharingCode(new UserId());

    await psqlSharingCodeRepository.save(sharingCode);

    const persistedSharingCode = await psqlSharingCodeRepository.findByCode(
      sharingCode.code
    );

    expect(persistedSharingCode).toEqual(sharingCode);
  });
});

afterAll(() => {
  return database.destroy();
});
