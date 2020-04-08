import { JsonSchema } from '../dtos/tests';
import { InterpretationRuleDTO } from '../dtos/testTypes';

export interface CreateTestTypeCommand {
  name: string;
  resultsSchema: JsonSchema;
  interpretationRules: InterpretationRuleDTO[];
  neededPermissionToAddResults: string;
}

export interface UpdateTestTypeCommand {
  name?: string;
  resultsSchema?: JsonSchema;
  interpretationRules?: InterpretationRuleDTO[];
  neededPermissionToAddResults?: string;
}
