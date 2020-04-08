import { InterpretationTheme } from './InterpretationTheme';
import { JsonSchema } from './JsonSchema';

export interface InterpretationRuleDTO {
  output: {
    namePattern: string;
    theme: InterpretationTheme;
    propertyVariables: object;
  };
  condition: JsonSchema;
}
