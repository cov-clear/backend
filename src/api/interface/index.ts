export interface CreateTestTypeCommand {
  name: string;
  resultsSchema: object;
  neededPermissionToAddResults: string;
}

export interface Role {
  name: string;
  permissions: string[];
}

export interface Permission {
  name: string;
}

export interface TestInterpretationDTO {
  name: string;
  theme: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MUTED';
}

export interface TestTypeDTO {
  id: string;
  name: string;
  resultsSchema: object;
  neededPermissionToAddResults: string;
}

export interface TestDTO {
  id: string;
  userId: string;
  creationTime: Date;
  testType: TestTypeDTO;
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
