import { DomainValidationError } from '../DomainValidationError';

const DATE_STRING_REG_EXP = /^\d{4}-\d{2}-\d{2}$/;

export class DateOfBirth {
  constructor(readonly year: number, readonly month: number, readonly day: number) {
    DateOfBirth.validate(year, month, day);
  }

  get age(): number {
    const today = new Date();
    let age = today.getFullYear() - this.year;
    let monthDiff = today.getMonth() - this.month;
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.day)) {
      age -= 1;
    }
    return age;
  }

  toString() {
    return `${this.year}-${('0' + this.month).slice(-2)}-${('0' + this.day).slice(-2)}`;
  }

  private static validate(year: number, month: number, day: number) {
    const dateObj = new Date(year, month - 1, day);
    if (isNaN(new Date(year, month - 1, day).getTime())) {
      throw new DomainValidationError('dateOfBirth', 'Invalid date');
    }
    if (dateObj.getMonth() !== month - 1 || dateObj.getFullYear() !== year || dateObj.getDate() !== day) {
      throw new DomainValidationError('dateOfBirth', 'Invalid date');
    }
  }

  static fromString(dateString: string): DateOfBirth {
    if (!dateString.match(DATE_STRING_REG_EXP)) {
      throw new DomainValidationError('dateOfBirth', 'Invalid date format');
    }
    const dateParts = dateString.split('-').map((part) => parseInt(part, 10));
    return new DateOfBirth(dateParts[0], dateParts[1], dateParts[2]);
  }

  static fromDate(date: Date): DateOfBirth {
    if (isNaN(date.getTime())) {
      throw new DomainValidationError('dateOfBirth', 'Invalid date');
    }
    return new DateOfBirth(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }
}
