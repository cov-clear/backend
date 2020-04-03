import Ajv from 'ajv';

import { DomainValidationError } from './model/DomainValidationError';

const ajv = new Ajv({
  strictDefaults: true,
  strictKeywords: true,
});

export class Validators {
  static validateOptionalNotEmpty(fieldName: string, value?: string) {
    if (value !== undefined && value !== null && value.trim().length === 0) {
      throw new DomainValidationError(fieldName, 'Cannot be an empty string');
    }
  }

  static validateNotNullOrUndefined(fieldName: string, value: any) {
    if (value === null || value === undefined) {
      throw new DomainValidationError(fieldName, 'Cannot be null');
    }
  }

  static validateNotEmpty(fieldName: string, value: string) {
    if (!value || value.trim().length === 0) {
      throw new DomainValidationError(fieldName, 'Cannot be an empty string');
    }
  }

  static validateSchema(fieldName: string, schema: object) {
    if (!schema || !ajv.validateSchema(schema)) {
      throw new DomainValidationError(fieldName, 'Not a valid Json Schema');
    }
  }

  static validateJson(fieldName: string, doc: object, schema: object) {
    if (!schema || !doc || !ajv.validate(schema, doc)) {
      throw new DomainValidationError(fieldName, 'The document does not follow the schema');
    }
  }
}
