import { TestType } from './TestType';
import { TestTypeId } from './TestTypeId';

describe('TestType', () => {
  describe('schema validation', () => {
    it('should allow a test type to be created when the schema is valid', () => {
      const inputSchema = {
        type: 'object',
        properties: {
          c: { type: 'boolean', title: 'C' },
        },
      };

      expect(() => new TestType(new TestTypeId(), 'NAME', inputSchema, 'PERMISSION')).not.toThrow();
    });

    it('should not allow a test type to be created with an invalid schema', () => {
      const inputSchema = {
        type: 'WRONG_TYPE',
      };

      expect(() => new TestType(new TestTypeId(), 'NAME', inputSchema, 'PERMISSION')).toThrow();
    });
  });
});
