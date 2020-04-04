import { TestTypeId } from './TestTypeId';
import { Validators } from '../../Validators';
import { InterpretationRules } from '../test/interpretation/InterpretationRules';

export class TestType {
  constructor(
    readonly id: TestTypeId,
    readonly name: string,
    readonly resultsSchema: object,
    readonly neededPermissionToAddResults: string,
    readonly interpretationRules: InterpretationRules = InterpretationRules.fromSchema([])
  ) {
    Validators.validateNotEmpty('name', name);
    Validators.validateNotEmpty('neededPermissionToAddResults', neededPermissionToAddResults);
    Validators.validateNotNullOrUndefined('interpretationRules', interpretationRules);
    Validators.validateSchema('resultsSchema', resultsSchema);
  }
}
