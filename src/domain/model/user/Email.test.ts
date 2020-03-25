import { Email } from './Email';

describe('Email', () => {
  it('creates a valid email', () => {
    const email = new Email('kostas@gmail.com');
    expect(email.value()).toEqual('kostas@gmail.com');
  });

  it('does not allow creating an invalid email', () => {
    expect(() => new Email('@missing-local.org')).toThrow();
  });
});
