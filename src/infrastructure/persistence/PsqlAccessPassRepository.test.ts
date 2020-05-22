import database from '../../database';
import { PsqlAccessPassRepository } from './PsqlAccessPassRepository';
import { AccessPass } from '../../domain/model/accessPass/AccessPass';
import { UserId } from '../../domain/model/user/UserId';
import { v4 as uuidv4 } from 'uuid';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import MockDate from 'mockdate';

describe('PsqlAccessPassRepository', () => {
  const psqlAccessPassRepository = new PsqlAccessPassRepository(database);

  beforeEach(async () => {
    await cleanupDatabase();
    MockDate.reset();
  });

  it('inserts new and retrieves a access pass', async () => {
    const actorUserId = new UserId();
    const subjectUserId = new UserId();

    const accessPass = new AccessPass(actorUserId, subjectUserId, 120);
    await psqlAccessPassRepository.save(accessPass);

    const persistedAccessPass = await psqlAccessPassRepository.findByUserIds(actorUserId, subjectUserId);

    expect(persistedAccessPass).toEqual(accessPass);
  });

  it('retrieves the pass with most recent created time when there are multiple', async () => {
    const actorUserId = new UserId();
    const subjectUserId = new UserId();

    const firstPass = new AccessPass(actorUserId, subjectUserId, 60, uuidv4(), new Date('2020-01-01'));
    const secondPass = new AccessPass(actorUserId, subjectUserId, 120, uuidv4(), new Date('2020-01-02'));
    const thirdPass = new AccessPass(actorUserId, subjectUserId, 180, uuidv4(), new Date('2020-01-03'));

    await psqlAccessPassRepository.save(firstPass);
    await psqlAccessPassRepository.save(thirdPass);
    await psqlAccessPassRepository.save(secondPass);

    const persistedAccessPass = await psqlAccessPassRepository.findByUserIds(actorUserId, subjectUserId);

    expect(persistedAccessPass).toEqual(thirdPass);
  });

  it('retrieves all access passes for the actor with latet first', async () => {
    const actorUserId = new UserId();

    MockDate.set('2020-01-01T00:00:00Z');
    const firstPass = new AccessPass(actorUserId, new UserId(), 60);

    MockDate.set('2020-01-01T00:00:01Z');
    const secondPass = new AccessPass(actorUserId, new UserId(), 120);

    MockDate.set('2020-01-01T00:00:02Z');
    const thirdPass = new AccessPass(actorUserId, new UserId(), 180);

    await psqlAccessPassRepository.save(firstPass);
    await psqlAccessPassRepository.save(thirdPass);
    await psqlAccessPassRepository.save(secondPass);

    MockDate.set('2020-01-01T01:01:00Z');

    const accessPasses = await psqlAccessPassRepository.findByActorId(actorUserId);

    expect(accessPasses.length).toBe(3);
    expect(accessPasses[0]).toEqual(thirdPass);
    expect(accessPasses[1]).toEqual(secondPass);
    expect(accessPasses[2]).toEqual(firstPass);
  });
});

afterAll(() => {
  return database.destroy();
});
