import { DomainValidationError } from '../DomainValidationError';
import { TestTypeId } from './TestTypeId';
import { Validators } from '../../Validators';

export class TestType {
  constructor(
    readonly id: TestTypeId,
    readonly name: string,
    readonly resultsSchema: object,
    readonly neededPermissionToAddResults: string
  ) {
    Validators.validateNotEmpty('name', name);
    Validators.validateNotEmpty('neededPermissionToAddResults', neededPermissionToAddResults);
    Validators.validateSchema('resultsSchema', resultsSchema);
  }
}
