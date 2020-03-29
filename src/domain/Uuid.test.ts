import { Uuid } from './Uuid';

describe('Uuid', () => {
  it('defines a working equals method', () => {
    const uuid1 = new Uuid();
    const uuid2 = new Uuid(uuid1.value);
    const uuid3 = new Uuid();

    expect(uuid1 === uuid2).toBe(false);
    expect(uuid1.equals(uuid2)).toBe(true);
    expect(uuid1.equals(uuid3)).toBe(false);
    expect(uuid1.equals({ value: uuid1.value })).toBe(false);
  });
});
