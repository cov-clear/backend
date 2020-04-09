import { JsonSchema } from '../../dtos/tests/JsonSchema';
import { InterpretationRuleDTO } from '../../dtos/tests/InterpretationRuleDTO';

export interface UpdateTestTypeCommand {
  name?: string;
  resultsSchema?: JsonSchema;
  interpretationRules?: InterpretationRuleDTO[];
  neededPermissionToAddResults?: string;
}
