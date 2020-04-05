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

export interface InterpretationRuleDTO {
  output: {
    namePattern: string;
    theme: InterpretationTheme;
    propertyVariables: object;
  };
  condition: JsonSchema;
}

type JsonSchema = object;

type InterpretationTheme = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MUTED';

export interface Role {
  name: string;
  permissions: string[];
}

export interface Permission {
  name: string;
}

export interface TestInterpretationDTO {
  name: string;
  theme: InterpretationTheme;
}

export interface TestTypeDTO {
  id: string;
  name: string;
  resultsSchema: JsonSchema;
  neededPermissionToAddResults: string;
  interpretationRules: InterpretationRuleDTO[];
}

export interface TestTypeSimpleDTO {
  id: string;
  name: string;
  neededPermissionToAddResults: string;
}

export interface TestDTO {
  id: string;
  userId: string;
  creationTime: Date;
  testType: TestTypeSimpleDTO;
  administeredBy: {
    userId: string;
  };
  administrationConfidence: string;
  resultsInterpretations: TestInterpretationDTO[];
  results: TestResultsDTO | null;
}

export interface TestResultsDTO {
  details: object;
  createdBy: { userId: string };
  creationTime: Date;
  notes: string;
  entryConfidence: string;
}

export interface TestCommand {
  testTypeId: string;
  results?: TestResultsCommand;
}

export interface TestResultsCommand {
  details: object;
  notes?: string;
}
