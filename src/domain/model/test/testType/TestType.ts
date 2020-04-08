import { TestTypeId } from './TestTypeId';
import { Validators } from '../../../Validators';
import { InterpretationRules } from '../interpretation/InterpretationRules';

export class TestType {
  constructor(
    readonly id: TestTypeId,
    public name: string,
    public resultsSchema: object,
    public neededPermissionToAddResults: string,
    public interpretationRules: InterpretationRules = InterpretationRules.fromSchema([])
  ) {
    Validators.validateNotEmpty('name', name);
    Validators.validateNotEmpty('neededPermissionToAddResults', neededPermissionToAddResults);
    Validators.validateNotNullOrUndefined('interpretationRules', interpretationRules);
    Validators.validateSchema('resultsSchema', resultsSchema);
  }
}
