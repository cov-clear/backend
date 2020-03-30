import database from '../../database';
import { PsqlAccessPassRepository } from './PsqlAccessPassRepository';
import { AccessPass } from '../../domain/model/accessPass/AccessPass';
import { UserId } from '../../domain/model/user/UserId';
import { v4 as uuidv4 } from 'uuid';
import { cleanupDatabase } from '../../test/cleanupDatabase';

describe('PsqlAccessPassRepository', () => {
  const psqlAccessPassRepository = new PsqlAccessPassRepository(database);

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('inserts new and retrieves a access pass', async () => {
    const actorUserId = new UserId();
    const subjectUserId = new UserId();

    const accessPass = new AccessPass(actorUserId, subjectUserId);
    await psqlAccessPassRepository.save(accessPass);

    const persistedAccessPass = await psqlAccessPassRepository.findByUserIds(
      actorUserId,
      subjectUserId
    );

    expect(persistedAccessPass).toEqual(accessPass);
  });

  it('retrieves the pass with most recent created time when there are multiple', async () => {
    const actorUserId = new UserId();
    const subjectUserId = new UserId();

    const firstPass = new AccessPass(
      actorUserId,
      subjectUserId,
      uuidv4(),
      new Date('2020-01-01')
    );

    const secondPass = new AccessPass(
      actorUserId,
      subjectUserId,
      uuidv4(),
      new Date('2020-01-02')
    );

    const thirdPass = new AccessPass(
      actorUserId,
      subjectUserId,
      uuidv4(),
      new Date('2020-01-03')
    );

    await psqlAccessPassRepository.save(firstPass);
    await psqlAccessPassRepository.save(thirdPass);
    await psqlAccessPassRepository.save(secondPass);

    const persistedAccessPass = await psqlAccessPassRepository.findByUserIds(
      actorUserId,
      subjectUserId
    );

    expect(persistedAccessPass).toEqual(thirdPass);
  });
});

afterAll(() => {
  return database.destroy();
});
