import { MagicLink } from './MagicLink';
import { v4 as uuidv4 } from 'uuid';
import MockDate from 'mockdate';
import { Email } from '../user/Email';

describe('Magic Link', () => {
  afterEach(() => {
    MockDate.reset();
  });

  it('creates a new magic link', () => {
    const magicLink = new MagicLink(
      uuidv4(),
      new Email('kostas@gmail.com'),
      uuidv4(),
      true,
      new Date()
    );
    expect(magicLink.id).toBeDefined();
    expect(magicLink.email).toBeDefined();
    expect(magicLink.code).toBeDefined();
    expect(magicLink.creationTime).toBeDefined();
    expect(magicLink.isExpired()).toBe(false);
  });

  it('isExpired() works', () => {
    MockDate.set('2020-11-03 00:00:00');
    const magicLink = new MagicLink(
      uuidv4(),
      new Email('kostas@gmail.com'),
      uuidv4(),
      true,
      new Date()
    );

    MockDate.set('2020-11-03 02:06:00');
    expect(magicLink.isExpired()).toBe(true);
  });
});
