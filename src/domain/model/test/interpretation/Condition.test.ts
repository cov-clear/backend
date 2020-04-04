import { Condition } from './Condition';

describe('Condition', () => {
  describe('SimpleCondition', () => {
    it('does not accept an invalid schema', () => {
      expect(() =>
        Condition.fromSchema({
          type: 'WRONG_TYPE',
        })
      ).toThrow();
    });

    it('correctly evaluates ">="', () => {
      const condition = Condition.fromSchema({
        type: 'object',
        properties: {
          c: { type: 'number', minimum: 30 },
        },
        required: ['c'],
      });

      expect(condition.evaluate({ c: 30 })).toBe(true);
      expect(condition.evaluate({ c: 31 })).toBe(true);
      expect(condition.evaluate({ c: 29 })).toBe(false);
    });

    it('correctly evaluates ">"', () => {
      const condition = Condition.fromSchema({
        type: 'object',
        properties: {
          c: { type: 'number', not: { maximum: 30 } },
        },
        required: ['c'],
      });

      expect(condition.evaluate({ c: 29 })).toBe(false);
      expect(condition.evaluate({ c: 30 })).toBe(false);
      expect(condition.evaluate({ c: 31 })).toBe(true);
    });

    it('correctly evaluates "<="', () => {
      const condition = Condition.fromSchema({
        type: 'object',
        properties: {
          c: { type: 'number', maximum: 30 },
        },
        required: ['c'],
      });

      expect(condition.evaluate({ c: 29 })).toBe(true);
      expect(condition.evaluate({ c: 30 })).toBe(true);
      expect(condition.evaluate({ c: 31 })).toBe(false);
    });

    it('correctly evaluates "<"', () => {
      const condition = Condition.fromSchema({
        type: 'object',
        properties: {
          c: { type: 'number', not: { minimum: 30 } },
        },
        required: ['c'],
      });

      expect(condition.evaluate({ c: 29 })).toBe(true);
      expect(condition.evaluate({ c: 30 })).toBe(false);
      expect(condition.evaluate({ c: 31 })).toBe(false);
    });

    it('correctly evaluates "==" for numbers', () => {
      const condition = Condition.fromSchema({
        type: 'object',
        properties: {
          c: { type: 'number', const: 30 },
        },
        required: ['c'],
      });

      expect(condition.evaluate({ c: 20 })).toBe(false);
      expect(condition.evaluate({ c: 30 })).toBe(true);
    });

    it('correctly evaluates "==" for strings', () => {
      const condition = Condition.fromSchema({
        type: 'object',
        properties: {
          c: { type: 'string', const: 'value' },
        },
        required: ['c'],
      });

      expect(condition.evaluate({ c: 'value2' })).toBe(false);
      expect(condition.evaluate({ c: 'value' })).toBe(true);
    });

    it('correctly evaluates "==" for booleans', () => {
      const condition = Condition.fromSchema({
        type: 'object',
        properties: {
          c: { type: 'boolean', const: false },
        },
        required: ['c'],
      });

      expect(condition.evaluate({ c: true })).toBe(false);
      expect(condition.evaluate({ c: false })).toBe(true);
    });

    it('correctly evaluates "!=" for numbers', () => {
      const condition = Condition.fromSchema({
        type: 'object',
        properties: {
          c: { type: 'number', not: { const: 30 } },
        },
        required: ['c'],
      });

      expect(condition.evaluate({ c: 20 })).toBe(true);
      expect(condition.evaluate({ c: 30 })).toBe(false);
    });

    it('correctly evaluates "!=" for strings', () => {
      const condition = Condition.fromSchema({
        type: 'object',
        properties: {
          c: { type: 'string', not: { const: 'value' } },
        },
        required: ['c'],
      });

      expect(condition.evaluate({ c: 'value2' })).toBe(true);
      expect(condition.evaluate({ c: 'value' })).toBe(false);
    });

    it('correctly evaluates "!=" for booleans', () => {
      const condition = Condition.fromSchema({
        type: 'object',
        properties: {
          c: { type: 'boolean', not: { const: false } },
        },
        required: ['c'],
      });

      expect(condition.evaluate({ c: true })).toBe(true);
      expect(condition.evaluate({ c: false })).toBe(false);
    });
  });

  describe('AndCondition', () => {
    it('correctly calculates conjugation', () => {
      const condition = Condition.fromSchema({
        type: 'object',
        properties: {
          c: { type: 'number', minimum: 2 },
          b: { type: 'boolean', const: false },
        },
        required: ['c', 'b'],
      });

      expect(condition.evaluate({ c: 3, b: false })).toBe(true);
      expect(condition.evaluate({ c: 1, b: false })).toBe(false);
      expect(condition.evaluate({ c: 3, b: true })).toBe(false);
      expect(condition.evaluate({ c: 1, b: true })).toBe(false);
    });
  });

  describe('OrCondition', () => {
    it('correctly calculates disjunction', () => {
      const condition = Condition.fromSchema({
        anyOf: [
          {
            type: 'object',
            properties: {
              c: { type: 'number', minimum: 2 },
            },
            required: ['c'],
          },
          {
            type: 'object',
            properties: {
              b: { type: 'boolean', const: false },
            },
            required: ['c'],
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
      const condition = Condition.fromSchema({
        anyOf: [
          {
            type: 'object',
            properties: {
              c: { type: 'number', minimum: 2 },
            },
            required: ['c'],
          },
          {
            type: 'object',
            properties: {
              c: { type: 'number', not: { minimum: 2 } },
              b: { type: 'boolean', not: { const: true } },
            },
            required: ['b', 'c'],
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
