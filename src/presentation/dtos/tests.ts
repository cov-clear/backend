export interface TestInterpretationDTO {
  name: string;
  theme: InterpretationTheme;
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
  creator: {
    userId: string;
    confidence: string;
  };
  resultsInterpretations: TestInterpretationDTO[];
  results: TestResultsDTO | null;
}

export interface TestResultsDTO {
  details: object;
  creationTime: Date;
  notes: string;
  creator: {
    userId: string;
    confidence: string;
  };
}

export type JsonSchema = object;
export type InterpretationTheme = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MUTED';
