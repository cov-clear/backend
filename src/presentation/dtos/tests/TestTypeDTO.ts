import { JsonSchema } from './JsonSchema';
import { InterpretationRuleDTO } from './InterpretationRuleDTO';

export interface TestTypeDTO {
  id: string;
  name: string;
  resultsSchema: JsonSchema;
  neededPermissionToAddResults: string;
  interpretationRules: InterpretationRuleDTO[];
}
