import { TestTypeId } from './TestTypeId';
import { DomainValidationError } from '../DomainValidationError';

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

//TODO: Add proper schema validation
function validateResultsSchema(schema: object) {
  return !!schema;
}
