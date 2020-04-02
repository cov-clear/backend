import { ConfidenceLevel } from './ConfidenceLevel';

describe('enum', () => {
  it('parses enum correctly', () => {
    expect(ConfidenceLevel.fromString('LOW')).toEqual(ConfidenceLevel.LOW);
    expect(() => ConfidenceLevel.fromString('UNKNOWN')).toThrow();
  });
});
