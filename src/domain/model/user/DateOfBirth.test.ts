import { DateOfBirth } from './DateOfBirth';
import { DomainValidationError } from '../DomainValidationError';

describe('DateOfBirth', () => {
  it('correctly calculates age and toString', () => {
    let dateOfBirth = new DateOfBirth(1979, 8, 15);
    expect(dateOfBirth.age).toBeGreaterThanOrEqual(40);
    expect(dateOfBirth.toString()).toEqual('1979-08-15');
  });

  describe('fromString', () => {
    it('accepts date of format YYYY-MM-DD', () => {
      const date = DateOfBirth.fromString('1990-02-24');
      expect(date.year).toEqual(1990);
      expect(date.month).toEqual(2);
      expect(date.day).toEqual(24);
    });

    it('throws error if date string is not in expected format', () => {
      expect(() => DateOfBirth.fromString('14-02-1989')).toThrow(
        new DomainValidationError('dateOfBirth', 'Invalid date format')
      );
    });

    it('throws error if date is not a valid date', () => {
      expect(() => DateOfBirth.fromString('1989-14-32')).toThrow(
        new DomainValidationError('dateOfBirth', 'Invalid date')
      );
    });
  });

  describe('fromDate', () => {
    it('accepts a valid date', () => {
      const date = new Date('2019-05-02');
      const dateOfBirth = DateOfBirth.fromDate(date);
      expect(dateOfBirth.year).toEqual(date.getFullYear());
      expect(dateOfBirth.month).toEqual(date.getMonth() + 1);
      expect(dateOfBirth.day).toEqual(date.getDate());
      expect(dateOfBirth.toString()).toEqual('2019-05-02');
    });

    it('throws error if date is not a valid date', () => {
      expect(() => DateOfBirth.fromDate(new Date('invalid date'))).toThrow(
        new DomainValidationError('dateOfBirth', 'Invalid date')
      );
    });
  });
});
