import { AccessPass } from './AccessPass';
import MockDate from 'mockdate';
import { UserId } from '../user/UserId';

describe('Access Pass', () => {
  afterEach(() => {
    MockDate.reset();
  });

  it('creates a new access pass', () => {
    const actorUserId = new UserId();
    const subjectUserId = new UserId();

    const accessPass = new AccessPass(actorUserId, subjectUserId, 120);

    expect(accessPass.actorUserId).toBe(actorUserId);
    expect(accessPass.subjectUserId).toBe(subjectUserId);
    expect(accessPass.creationTime).toBeDefined();
    expect(accessPass.isExpired()).toBe(false);
  });

  it('isExpired() works', () => {
    const actorUserId = new UserId();
    const subjectUserId = new UserId();

    MockDate.set('2020-11-03 00:00:00');

    const accessPass = new AccessPass(actorUserId, subjectUserId, 120);

    // More than default duration
    MockDate.set('2020-11-03 01:01:00');

    expect(accessPass.isExpired()).toBe(false);

    // More than specified duration
    MockDate.set('2020-11-03 02:01:00');

    expect(accessPass.isExpired()).toBe(true);
  });
});
