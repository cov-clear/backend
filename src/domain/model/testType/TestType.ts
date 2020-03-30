import { TestTypeId } from './TestTypeId';
import { DomainValidationError } from '../DomainValidationError';
import Ajv from 'ajv';

const ajv = new Ajv({
  strictDefaults: true,
  strictKeywords: true,
});

export class TestType {
  constructor(
    readonly id: TestTypeId,
    readonly name: string,
    readonly resultsSchema: object,
    readonly neededPermissionToAddResults: string
  ) {
    validateNotEmptyString('name', name);
    validateNotEmptyString(
      'neededPermissionToAddResults',
      neededPermissionToAddResults
    );
    validateResultsSchema(resultsSchema);
  }
}

function validateNotEmptyString(fieldName: string, value: string) {
  if (!value || value.length === 0) {
    throw new DomainValidationError(fieldName, value);
  }
}

function validateResultsSchema(schema: object) {
  if (!schema || !ajv.validateSchema(schema)) {
    throw new DomainValidationError('resultsSchema', 'Not a valid Json Schema');
  }
}
