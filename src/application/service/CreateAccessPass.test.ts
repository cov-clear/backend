import database from '../../database';
import { accessPassRepository, sharingCodeRepository } from '../../infrastructure/persistence';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { UserId } from '../../domain/model/user/UserId';
import { SharingCode } from '../../domain/model/sharingCode/SharingCode';
import { createAccessPass } from './index';

describe('CreateAccessPass', () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('creates a new access pass given a valid sharing code', async () => {
    const actorUserId = new UserId();
    const subjectUserId = new UserId();

    const sharingCode = new SharingCode(subjectUserId);
    await sharingCodeRepository.save(sharingCode);

    const createdAccessPass = await createAccessPass.withSharingCode(sharingCode.code, actorUserId.value);

    const persistedAccessPass = await accessPassRepository.findByUserIds(actorUserId, subjectUserId);

    expect(persistedAccessPass).toEqual(createdAccessPass);
  });
});

afterAll(() => {
  return database.destroy();
});
