import { InterpretationTheme, JsonSchema } from './tests';

export interface InterpretationRuleDTO {
  output: {
    namePattern: string;
    theme: InterpretationTheme;
    propertyVariables: object;
  };
  condition: JsonSchema;
}

export interface TestTypeDTO {
  id: string;
  name: string;
  resultsSchema: JsonSchema;
  neededPermissionToAddResults: string;
  interpretationRules: InterpretationRuleDTO[];
}
