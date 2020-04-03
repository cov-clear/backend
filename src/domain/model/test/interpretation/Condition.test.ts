import { SimpleCondition } from 'aws-sdk/clients/pinpoint';
import { Condition } from './Condition';

describe('Condition', () => {
  describe('SimpleCondition', () => {
    it('does not accept an invalid condition', () => {
      expect(() => Condition.from({})).toThrow();
      expect(() => Condition.from({ property: null, value: 3, comparator: '==' })).toThrow();
      expect(() => Condition.from({ property: 'a', value: null, comparator: '' })).toThrow();
      expect(() => Condition.from({ property: 'a', value: 3, comparator: '' })).toThrow();
    });

    it('correctly evaluates ">="', () => {
      const condition = Condition.from({
        property: 'c',
        comparator: '>=',
        value: 30,
      });

      expect(condition.evaluate({ c: 30 })).toBe(true);
      expect(condition.evaluate({ c: 31 })).toBe(true);
      expect(condition.evaluate({ c: 29 })).toBe(false);
    });

    it('correctly evaluates ">"', () => {
      const condition = Condition.from({
        property: 'c',
        comparator: '>',
        value: 30,
      });

      expect(condition.evaluate({ c: 29 })).toBe(false);
      expect(condition.evaluate({ c: 30 })).toBe(false);
      expect(condition.evaluate({ c: 31 })).toBe(true);
    });

    it('correctly evaluates "<="', () => {
      const condition = Condition.from({
        property: 'c',
        comparator: '<=',
        value: 30,
      });

      expect(condition.evaluate({ c: 29 })).toBe(true);
      expect(condition.evaluate({ c: 30 })).toBe(true);
      expect(condition.evaluate({ c: 31 })).toBe(false);
    });

    it('correctly evaluates "<"', () => {
      const condition = Condition.from({
        property: 'c',
        comparator: '<',
        value: 30,
      });

      expect(condition.evaluate({ c: 29 })).toBe(true);
      expect(condition.evaluate({ c: 30 })).toBe(false);
      expect(condition.evaluate({ c: 31 })).toBe(false);
    });

    it('correctly evaluates "==" for numbers', () => {
      const condition = Condition.from({
        property: 'c',
        comparator: '==',
        value: 30,
      });

      expect(condition.evaluate({ c: 20 })).toBe(false);
      expect(condition.evaluate({ c: 30 })).toBe(true);
    });

    it('correctly evaluates "==" for strings', () => {
      const condition = Condition.from({
        property: 'c',
        comparator: '==',
        value: 'value',
      });

      expect(condition.evaluate({ c: 'value2' })).toBe(false);
      expect(condition.evaluate({ c: 'value' })).toBe(true);
    });

    it('correctly evaluates "==" for booleans', () => {
      const condition = Condition.from({
        property: 'c',
        comparator: '==',
        value: false,
      });

      expect(condition.evaluate({ c: true })).toBe(false);
      expect(condition.evaluate({ c: false })).toBe(true);
    });

    it('correctly evaluates "!=" for numbers', () => {
      const condition = Condition.from({
        property: 'c',
        comparator: '!=',
        value: 30,
      });

      expect(condition.evaluate({ c: 20 })).toBe(true);
      expect(condition.evaluate({ c: 30 })).toBe(false);
    });

    it('correctly evaluates "!=" for strings', () => {
      const condition = Condition.from({
        property: 'c',
        comparator: '!=',
        value: 'value',
      });

      expect(condition.evaluate({ c: 'value2' })).toBe(true);
      expect(condition.evaluate({ c: 'value' })).toBe(false);
    });

    it('correctly evaluates "!=" for booleans', () => {
      const condition = Condition.from({
        property: 'c',
        comparator: '!=',
        value: false,
      });

      expect(condition.evaluate({ c: true })).toBe(true);
      expect(condition.evaluate({ c: false })).toBe(false);
    });
  });

  describe('AndCondition', () => {
    it('throws an error for an invalid AND condition', () => {
      expect(() => Condition.from({ and: {} })).toThrow();
    });

    it('correctly calculates conjugation', () => {
      const condition = Condition.from({
        and: [
          {
            property: 'c',
            comparator: '>=',
            value: 2,
          },
          {
            property: 'b',
            comparator: '==',
            value: false,
          },
        ],
      });

      expect(condition.evaluate({ c: 3, b: false })).toBe(true);
      expect(condition.evaluate({ c: 1, b: false })).toBe(false);
      expect(condition.evaluate({ c: 3, b: true })).toBe(false);
      expect(condition.evaluate({ c: 1, b: true })).toBe(false);
    });
  });

  describe('OrCondition', () => {
    it('throws an error for an invalid OR condition', () => {
      expect(() => Condition.from({ or: {} })).toThrow();
    });

    it('correctly calculates disjunction', () => {
      const condition = Condition.from({
        or: [
          {
            property: 'c',
            comparator: '>=',
            value: 2,
          },
          {
            property: 'b',
            comparator: '==',
            value: false,
          },
        ],
      });

      expect(condition.evaluate({ c: 3, b: false })).toBe(true);
      expect(condition.evaluate({ c: 1, b: false })).toBe(true);
      expect(condition.evaluate({ c: 3, b: true })).toBe(true);
      expect(condition.evaluate({ c: 1, b: true })).toBe(false);
    });
  });

  describe('Nested Conditions', () => {
    it('correctly calculates complex nested expressions', () => {
      const condition = Condition.from({
        or: [
          {
            property: 'c',
            comparator: '>=',
            value: 2,
          },
          {
            and: [
              {
                property: 'c',
                comparator: '<',
                value: 2,
              },
              {
                property: 'b',
                comparator: '!=',
                value: true,
              },
            ],
          },
        ],
      });

      expect(condition.evaluate({ c: 3, b: true })).toBe(true);
      expect(condition.evaluate({ c: 3, b: false })).toBe(true);
      expect(condition.evaluate({ c: 1, b: false })).toBe(true);
      expect(condition.evaluate({ c: 1, b: true })).toBe(false);
    });
  });
});
